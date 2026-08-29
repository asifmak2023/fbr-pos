from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
import uuid

from app.database import get_db
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.models.user import User
from app.models.fbr_submission import FBRSubmission
from app.routes.auth import get_current_user
from app.services.fbr_client import FBRClient
import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/sales", tags=["sales"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_sale(
    sale_data: dict,  # We'll use dict for now to keep it simple
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sale (POS transaction)"""
    
    # Generate invoice number
    invoice_number = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    
    # Calculate totals
    total_amount = 0
    tax_amount = 0
    grand_total = 0
    
    try:
        # Determine scenario ID based on business context
        scenario_id = sale_data.get("scenario_id", "SN002")  # Default to SN002 for normal POS
        if not scenario_id:
            # Auto-determine scenario based on buyer type
            if sale_data.get("customer_registration_type") == "Registered":
                scenario_id = "SN001"
            else:
                scenario_id = "SN002"
        
        # Create sale record
        new_sale = Sale(
            invoice_number=invoice_number,
            customer_name=sale_data.get("customer_name", "Walk-in Customer"),
            customer_ntn_cnic=sale_data.get("customer_ntn_cnic"),
            customer_phone=sale_data.get("customer_phone"),
            customer_address=sale_data.get("customer_address"),
            customer_registration_type=sale_data.get("customer_registration_type", "Unregistered"),
            payment_method=sale_data.get("payment_method", "Cash"),
            discount_amount=sale_data.get("discount_amount", 0),
            created_by=current_user.id,
            status="Completed"
        )
        db.add(new_sale)
        db.flush()
        
        # Process each item
        for item_data in sale_data.get("items", []):
            product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item_data['product_id']} not found")
            
            if product.quantity < item_data["quantity"]:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
            
            product.quantity -= item_data["quantity"]
            
            item_total = item_data["quantity"] * item_data["unit_price"]
            # Use product's actual tax rate instead of hardcoded 0.18
            product_tax_rate = float(product.tax_rate.replace("%", "")) / 100 if product.tax_rate and "%" in product.tax_rate else 0.18
            item_tax = item_total * product_tax_rate
            item_grand_total = item_total + item_tax - item_data.get("discount", 0)
            
            sale_item = SaleItem(
                sale_id=new_sale.id,
                product_id=product.id,
                product_name=product.name,
                sku=product.sku,
                hs_code=product.hs_code,
                tax_rate=product.tax_rate or "18%",
                uom=product.uom,
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                discount=item_data.get("discount", 0),
                tax_amount=item_tax,
                total_amount=item_grand_total
            )
            db.add(sale_item)
            
            total_amount += item_total
            tax_amount += item_tax
            grand_total += item_grand_total
        
        new_sale.total_amount = total_amount
        new_sale.tax_amount = tax_amount
        new_sale.grand_total = grand_total - sale_data.get("discount_amount", 0)
        
        db.commit()
        db.refresh(new_sale)

        # Send to FBR
        try:
            fbr_client = FBRClient()
            fbr_response = fbr_client.post_invoice(new_sale, scenario_id)
            
            # Create FBR submission record
            fbr_submission = FBRSubmission(
                sale_id=new_sale.id,
                scenario_id=scenario_id,
                request_payload=fbr_client.build_invoice_payload(new_sale, scenario_id),
                response_payload=fbr_response,
                http_status=200 if "invoiceNumber" in fbr_response else 400,
                attempt_count=1
            )
            
            if "invoiceNumber" in fbr_response:
                new_sale.fbr_invoice_number = fbr_response["invoiceNumber"]
                new_sale.fbr_status = "Posted"
                new_sale.fbr_status_code = fbr_response.get("statusCode", "00")
                fbr_submission.submission_status = "Success"
                fbr_submission.fbr_invoice_number = fbr_response["invoiceNumber"]
                fbr_submission.fbr_status_code = fbr_response.get("statusCode", "00")
                fbr_submission.responded_at = datetime.utcnow()
            elif fbr_response.get("statusCode") == "01":
                new_sale.fbr_status = "Failed"
                new_sale.fbr_status_code = "01"
                new_sale.fbr_error_code = fbr_response.get("errorCode")
                new_sale.fbr_error_message = fbr_response.get("error")
                fbr_submission.submission_status = "Failed"
                fbr_submission.fbr_status_code = "01"
                fbr_submission.fbr_error_code = fbr_response.get("errorCode")
                fbr_submission.fbr_error_message = fbr_response.get("error")
                fbr_submission.responded_at = datetime.utcnow()
            elif "errorCode" in fbr_response:
                new_sale.fbr_status = "Failed"
                new_sale.fbr_status_code = fbr_response.get("statusCode", "99")
                new_sale.fbr_error_code = fbr_response.get("errorCode")
                new_sale.fbr_error_message = fbr_response.get("error")
                fbr_submission.submission_status = "Failed"
                fbr_submission.fbr_status_code = fbr_response.get("statusCode", "99")
                fbr_submission.fbr_error_code = fbr_response.get("errorCode")
                fbr_submission.fbr_error_message = fbr_response.get("error")
                fbr_submission.responded_at = datetime.utcnow()
            else:
                new_sale.fbr_status = "Error"
                new_sale.fbr_status_code = "99"
                new_sale.fbr_error_message = str(fbr_response.get("error", "Unknown FBR error"))
                fbr_submission.submission_status = "Failed"
                fbr_submission.fbr_status_code = "99"
                fbr_submission.fbr_error_message = str(fbr_response.get("error", "Unknown FBR error"))
                fbr_submission.responded_at = datetime.utcnow()
            
            db.add(fbr_submission)
            db.commit()
            db.refresh(new_sale)
        except Exception as e:
            logger.error(f"FBR processing failed: {e}")
            new_sale.fbr_status = "Failed"
            new_sale.fbr_error_message = str(e)
            
            # Create failed submission record
            fbr_submission = FBRSubmission(
                sale_id=new_sale.id,
                scenario_id=scenario_id,
                submission_status="Failed",
                fbr_error_message=str(e),
                responded_at=datetime.utcnow()
            )
            db.add(fbr_submission)
            db.commit()
            
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Sale creation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Sale creation failed: {str(e)}")
    
    return {
        "id": new_sale.id,
        "invoice_number": new_sale.invoice_number,
        "customer_name": new_sale.customer_name,
        "total_amount": new_sale.total_amount,
        "tax_amount": new_sale.tax_amount,
        "grand_total": new_sale.grand_total,
        "fbr_status": new_sale.fbr_status,
        "items": [
            {
                "product_name": item.product_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_amount": item.total_amount
            }
            for item in new_sale.items
        ]
    }

@router.get("/")
def list_sales(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).order_by(Sale.created_at.desc()).offset(skip).limit(limit).all()
    return sales

@router.get("/today/stats")
def get_today_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    
    stats = db.query(
        func.count(Sale.id).label("total_sales"),
        func.sum(Sale.grand_total).label("total_revenue"),
        func.sum(Sale.tax_amount).label("total_tax")
    ).filter(Sale.created_at >= start_of_day).first()
    
    return {
        "total_sales": stats.total_sales or 0,
        "total_revenue": float(stats.total_revenue or 0),
        "total_tax": float(stats.total_tax or 0)
    }