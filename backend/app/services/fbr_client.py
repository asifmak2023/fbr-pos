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
            "scenarioId": scenario_id,  # Dynamic scenario ID
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
        """Send raw invoice data to FBR and return the response (for scenario testing)."""
        if not invoice_data:
            logger.error("No invoice data provided")
            return {"error": "No invoice data provided", "statusCode": "99"}
        
        logger.info(f"Sending invoice data to FBR for scenario {invoice_data.get('scenarioId', 'unknown')}")
        return self._post_to_fbr(invoice_data, f"scenario {invoice_data.get('scenarioId', 'unknown')}")

    def _post_to_fbr(self, payload: Dict[str, Any], context: str) -> Dict[str, Any]:
        """Internal method to post payload to FBR."""
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(self.base_url, json=payload, headers=self.headers)
                response.raise_for_status()
                data = response.json()
                print(f"🚨 FBR FINAL RESPONSE for {context}: {data}")
                return data
        except httpx.HTTPStatusError as e:
            print(f"🔥 FBR ERROR DETAILS for {context}: {e.response.text}")
            logger.error(f"FBR HTTP error for {context}: {e.response.status_code} - {e.response.text}")
            return {"error": str(e), "statusCode": "99", "details": e.response.text}
        except Exception as e:
            logger.error(f"FBR client error for {context}: {e}")
            return {"error": str(e), "statusCode": "99"}