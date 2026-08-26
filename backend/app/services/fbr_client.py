import os
import json
import logging
import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.models.sale import Sale, SaleItem

load_dotenv()

logger = logging.getLogger(__name__)

class FBRClient:
    def __init__(self):
        self.env = os.getenv("FBR_ENV", "sandbox")
        self.token = os.getenv("FBR_SANDBOX_TOKEN", "dummy_token")
        if self.env == "sandbox":
            self.base_url = os.getenv("FBR_SANDBOX_URL")
        else:
            self.base_url = os.getenv("FBR_PRODUCTION_URL")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def build_invoice_payload(self, sale: Sale) -> Dict[str, Any]:
        """Build the FBR invoice JSON from a Sale record."""
        # Seller info from the company (you'll need to link company to sale)
        # For now, we'll use dummy values or fetch from the company.
        seller_ntn = "0786909"  # Replace with actual from company
        seller_name = "Company 8"
        seller_province = "Sindh"
        seller_address = "Karachi"

        # Buyer info from sale
        buyer_ntn = sale.customer_ntn_cnic or "1000000000000"
        buyer_name = sale.customer_name
        buyer_province = "Sindh"  # placeholder
        buyer_address = sale.customer_address or "Karachi"
        buyer_reg_type = sale.customer_registration_type or "Unregistered"

        items = []
        for item in sale.items:
            items.append({
                "hsCode": item.hs_code or "0101.2100",
                "productDescription": item.product_name,
                "rate": item.tax_rate or "18%",
                "uoM": item.uom or "Numbers, pieces, units",
                "quantity": item.quantity,
                "totalValues": item.total_amount + item.tax_amount,  # approximate
                "valueSalesExcludingST": item.total_amount,
                "fixedNotifiedValueOrRetailPrice": 0,
                "salesTaxApplicable": item.tax_amount,
                "salesTaxWithheldAtSource": 0,
                "extraTax": 0,
                "furtherTax": 0,
                "sroScheduleNo": "",
                "fedPayable": 0,
                "discount": item.discount,
                "saleType": "Goods at standard rate (default)",
                "sroItemSerialNo": ""
            })

        payload = {
            "invoiceType": "Sale Invoice",
            "invoiceDate": sale.sale_date.strftime("%Y-%m-%d"),
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
            "scenarioId": "SN001",  # For sandbox; remove for production
            "items": items
        }
        return payload

    def post_invoice(self, sale: Sale) -> Dict[str, Any]:
        """Send the invoice to FBR and return the response."""
        payload = self.build_invoice_payload(sale)
        logger.info(f"Sending invoice to FBR for sale {sale.id}")
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(self.base_url, json=payload, headers=self.headers)
                response.raise_for_status()
                data = response.json()
                logger.info(f"FBR response: {data}")
                return data
        except httpx.HTTPStatusError as e:
            logger.error(f"FBR HTTP error: {e.response.status_code} - {e.response.text}")
            return {"error": str(e), "statusCode": "99"}
        except Exception as e:
            logger.error(f"FBR client error: {e}")
            return {"error": str(e), "statusCode": "99"}