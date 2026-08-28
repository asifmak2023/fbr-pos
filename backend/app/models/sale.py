from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from ..database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    fbr_invoice_number = Column(String(50), nullable=True)
    
    customer_name = Column(String(255), nullable=False)
    customer_ntn_cnic = Column(String(20), nullable=True)
    customer_phone = Column(String(20), nullable=True)
    customer_address = Column(Text, nullable=True)
    customer_registration_type = Column(String(20), default="Unregistered")
    
    sale_date = Column(DateTime(timezone=True), server_default=func.now())
    total_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)
    
    payment_method = Column(String(50), default="Cash")
    payment_status = Column(String(20), default="Paid")
    
    fbr_status = Column(String(20), default="Pending")
    fbr_status_code = Column(String(10), nullable=True)
    fbr_error_code = Column(String(10), nullable=True)
    fbr_error_message = Column(Text, nullable=True)
    fbr_task_id = Column(String(100), nullable=True)
    
    status = Column(String(20), default="Completed")
    
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    product_name = Column(String(255), nullable=False)
    sku = Column(String(50), nullable=True)
    hs_code = Column(String(20), nullable=True)
    tax_rate = Column(String(20), nullable=True)
    uom = Column(String(50), nullable=True)
    
    quantity = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    
    fbr_item_status = Column(String(20), nullable=True)
    fbr_item_error_code = Column(String(10), nullable=True)
    fbr_item_error_message = Column(Text, nullable=True)
    
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product")