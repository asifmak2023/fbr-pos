from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, func
from ..database import Base





class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    barcode = Column(String(50), unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    
    # Pricing
    purchase_price = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    wholesale_price = Column(Float, default=0.0)
    retail_price = Column(Float, default=0.0)
    
    # Inventory
    quantity = Column(Float, default=0.0)
    min_stock_level = Column(Float, default=0.0)
    reorder_level = Column(Float, default=0.0)
    reorder_quantity = Column(Float, default=0.0)
    
    # FBR Tax Info (important for invoicing)
    hs_code = Column(String(20), nullable=True)
    tax_rate = Column(String(20), nullable=True)  # e.g., "18%", "0%"
    uom = Column(String(50), nullable=True)       # Unit of Measurement
    sale_type = Column(String(100), nullable=True)
    sro_schedule_no = Column(String(50), nullable=True)
    is_fed_applicable = Column(Boolean, default=False)
    fed_rate = Column(Float, default=0.0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_taxable = Column(Boolean, default=True)
    
    # Metadata
    # created_at = Column(DateTime(timezone=True), server_default=func.now())
    # updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())