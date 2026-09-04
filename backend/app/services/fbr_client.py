import os
import json
import logging
import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from ..models.sale import Sale, SaleItem

load_dotenv()

logger = logging.getLogger(__name__)

class FBRClient:
    def __init__(self):
        self.env = os.getenv("FBR_ENV", "sandbox")
        if self.env == "sandbox":
            self.token = os.getenv("FBR_SANDBOX_TOKEN", "dummy_token")
            self.base_url = os.getenv("FBR_SANDBOX_URL")
        else:
            self.token = os.getenv("FBR_PRODUCTION_TOKEN", "dummy_token")
            self.base_url = os.getenv("FBR_PRODUCTION_URL")
        
        if not self.base_url:
            raise ValueError(f"FBR base URL not configured for environment: {self.env}")
        
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def build_invoice_payload(self, sale: Sale, scenario_id: str = "SN002") -> Dict[str, Any]:
        """Build the FBR invoice JSON from a Sale record with dynamic scenario support."""
        # Seller info – get from environment
        seller_ntn = os.getenv("FBR_SELLER_NTN", "1234567")
        seller_name = os.getenv("FBR_SELLER_NAME", "Company 8")
        seller_province = os.getenv("FBR_SELLER_PROVINCE", "Sindh")
        seller_address = os.getenv("FBR_SELLER_ADDRESS", "Karachi")

        # Buyer info from sale
        buyer_ntn = sale.customer_ntn_cnic
        if not buyer_ntn:
            if sale.customer_registration_type == "Unregistered":
                buyer_ntn = "1234567"  # dummy for unregistered
            else:
                buyer_ntn = "1000000000000"  # dummy for registered

        buyer_name = sale.customer_name
        buyer_province = "Sindh"  # placeholder, could be from sale
        buyer_address = sale.customer_address or "Karachi"
        buyer_reg_type = sale.customer_registration_type or "Unregistered"

        items = []
        if not sale.items:
            logger.warning(f"No items found for sale {sale.id}")
            return {}
        
        for item in sale.items:
            # Safely parse values
            try:
                qty = float(item.quantity) if item.quantity else 0
                unit_price = float(item.unit_price) if item.unit_price else 0
            except (ValueError, TypeError):
                qty = 0
                unit_price = 0

            base_value = qty * unit_price

            # Determine tax rate
            rate_str = item.tax_rate or "18%"
            if rate_str.endswith("%"):
                rate_float = float(rate_str.replace("%", "")) / 100.0
            else:
                try:
                    rate_float = float(rate_str)
                except ValueError:
                    rate_float = 0.18

            tax_amount = base_value * rate_float

            items.append({
                "hsCode": item.hs_code or "0101.2100",
                "productDescription": item.product_name,
                "rate": rate_str,
                "uoM": item.uom or "Numbers, pieces, units",
                "quantity": round(qty, 4),
                "totalValues": 0.00,
                "valueSalesExcludingST": round(base_value, 2),
                "fixedNotifiedValueOrRetailPrice": 0.00,
                "salesTaxApplicable": round(tax_amount, 2),
                "salesTaxWithheldAtSource": 0.00,
                "extraTax": 0.00,
                "furtherTax": 0.00,
                "sroScheduleNo": "",
                "fedPayable": 0.00,
                "discount": round(item.discount or 0.0, 2),
                "saleType": "Goods at standard rate (default)",
                "sroItemSerialNo": ""
            })

        payload = {
            "invoiceType": "Sale Invoice",
            "invoiceDate": sale.sale_date.strftime("%Y-%m-%d") if sale.sale_date else datetime.utcnow().strftime("%Y-%m-%d"),
            "sellerNTNCNIC": seller_ntn,
            "sellerBusinessName": seller_name,
            "sellerProvince": seller_province,
            "sellerAddress": seller_address,
            "buyerNTNCNIC": buyer_ntn,
            "buyerBusinessName": buyer_name,
            "buyerProvince": buyer_province,
            "buyerAddress": buyer_address,
            "buyerRegistrationType": buyer_reg_type,
            "invoiceRefNo": "",
            "items": items
        }
        return payload

    def post_invoice(self, sale: Sale, scenario_id: str = "SN002") -> Dict[str, Any]:
        """Send the invoice to FBR and return the response with dynamic scenario support."""
        payload = self.build_invoice_payload(sale, scenario_id)
        
        if not payload:
            logger.error(f"Failed to build invoice payload for sale {sale.id}")
            return {"error": "Failed to build invoice payload", "statusCode": "99"}
        
        logger.info(f"Sending invoice to FBR for sale {sale.id} with scenario {scenario_id}")
        return self._post_to_fbr(payload, f"sale {sale.id}")

    def post_invoice_data(self, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send raw scenario invoice data to FBR.

        The PDF sample payloads use placeholder seller credentials (e.g. "8885801",
        "Company 8").  The FBR token is bound to the real seller NTN registered on
        IRIS, so we must replace sellerNTNCNIC / sellerBusinessName with the values
        from the environment before submitting – everything else (buyer, items, rates,
        hsCode, saleType, …) is kept exactly as the PDF specifies.
        """
        import copy

        if not invoice_data:
            logger.error("No invoice data provided")
            return {"error": "No invoice data provided", "statusCode": "99"}

        seller_ntn  = os.getenv("FBR_SELLER_NTN")
        seller_name = os.getenv("FBR_SELLER_NAME")

        if not seller_ntn:
            return {
                "error": "FBR_SELLER_NTN is not set in environment. "
                         "Set it to your registered NTN/CNIC in the .env file.",
                "statusCode": "99",
                "httpStatus": 0,
            }

        # Deep-copy so nested item dicts from the DB are not mutated or sent stale
        payload = copy.deepcopy(invoice_data)
        payload["sellerNTNCNIC"] = seller_ntn
        if seller_name:
            payload["sellerBusinessName"] = seller_name

        # Always use today's date — FBR/IRIS only processes invoices within the
        # current tax period; seed-file dates are static and will eventually fall
        # outside the accepted window, causing IRIS to show "Pending" indefinitely.
        payload["invoiceDate"] = datetime.utcnow().strftime("%Y-%m-%d")

        scenario_id = payload.get("scenarioId", "unknown")
        logger.info(
            "Submitting scenario %s with sellerNTNCNIC=%s date=%s",
            scenario_id, seller_ntn, payload["invoiceDate"],
        )
        return self._post_to_fbr(payload, f"scenario {scenario_id}")

    def _post_to_fbr(self, payload: Dict[str, Any], context: str) -> Dict[str, Any]:
        """Post payload to FBR and always return a dict – never raise on HTTP errors.

        The caller decides success/failure by inspecting the returned dict, not
        by catching exceptions.  We capture the full response body on every
        non-2xx status so the caller (and the frontend) can see what FBR said.
        """
        import re as _re
        try:
            with httpx.Client(timeout=60.0) as client:
                response = client.post(self.base_url, json=payload, headers=self.headers)
                http_status = response.status_code
                logger.info("FBR HTTP %s for %s", http_status, context)

                # FBR sometimes returns malformed JSON with trailing commas before
                # closing braces/brackets.  Strip them before parsing.
                raw_text = response.text
                try:
                    data = response.json()
                except Exception:
                    try:
                        cleaned = _re.sub(r',\s*([}\]])', r'\1', raw_text)
                        data = json.loads(cleaned)
                    except Exception:
                        data = {"rawBody": raw_text}

                # Promote validationResponse fields to the top level so that
                # _submit_and_record can find invoiceNumber / errorCode easily.
                vr = data.get("validationResponse")
                if isinstance(vr, dict):
                    item_statuses = vr.get("invoiceStatuses") or []
                    # Copy invoiceNumber from any item that has one
                    for item_status in item_statuses:
                        if item_status.get("invoiceNo"):
                            data.setdefault("invoiceNumber", str(item_status["invoiceNo"]))
                    # Propagate error info
                    data.setdefault("errorCode", None)
                    for item_status in item_statuses:
                        if item_status.get("errorCode"):
                            data["errorCode"] = item_status["errorCode"]
                            data["errorDescription"] = item_status.get("error", "")
                            break
                    # Top-level success check: statusCode "00" means success
                    if vr.get("statusCode") == "00" and not data.get("invoiceNumber"):
                        inv_no = vr.get("invoiceNumber") or vr.get("invoiceNo")
                        if inv_no:
                            data["invoiceNumber"] = str(inv_no)

                # Attach the HTTP status so callers can log it
                data["httpStatus"] = http_status

                if http_status >= 400:
                    # Preserve whatever FBR returned; add a top-level error key
                    # if one isn't already present so our success check works.
                    if "error" not in data:
                        data["error"] = f"HTTP {http_status}: {response.text[:500]}"
                    logger.error("FBR error for %s: HTTP %s – %s", context, http_status, response.text[:500])

                return data

        except httpx.TimeoutException as e:
            logger.error("FBR timeout for %s: %s", context, e)
            return {"error": f"Request timed out: {e}", "statusCode": "99", "httpStatus": 0}
        except Exception as e:
            logger.error("FBR client error for %s: %s", context, e)
            return {"error": str(e), "statusCode": "99", "httpStatus": 0}
