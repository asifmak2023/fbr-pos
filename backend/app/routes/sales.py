from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
import uuid

from ..database import get_db
from ..models.product import Product
from ..models.sale import Sale, SaleItem
from ..models.user import User
from .auth import get_current_user
from ..services.fbr_client import FBRClient

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
        created_by=current_user["id"],
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
        item_tax = item_total * 0.18
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
        fbr_response = fbr_client.post_invoice(new_sale)
        if "invoiceNumber" in fbr_response:
            new_sale.fbr_invoice_number = fbr_response["invoiceNumber"]
            new_sale.fbr_status = "Posted"
            new_sale.fbr_status_code = fbr_response.get("statusCode", "00")
        elif fbr_response.get("statusCode") == "01":
            new_sale.fbr_status = "Failed"
            new_sale.fbr_status_code = "01"
            new_sale.fbr_error_code = fbr_response.get("errorCode")
            new_sale.fbr_error_message = fbr_response.get("error")
        else:
            new_sale.fbr_status = "Error"
            new_sale.fbr_status_code = "99"
            new_sale.fbr_error_message = str(fbr_response.get("error", "Unknown FBR error"))
        db.commit()
        db.refresh(new_sale)
    except Exception as e:
        logger.error(f"FBR processing failed: {e}")
        new_sale.fbr_status = "Failed"
        new_sale.fbr_error_message = str(e)
        db.commit()
    
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