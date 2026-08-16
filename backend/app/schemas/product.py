from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ProductBase(BaseModel):
    sku: str
    barcode: Optional[str] = None
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    purchase_price: float = 0.0
    selling_price: float = 0.0
    wholesale_price: float = 0.0
    retail_price: float = 0.0
    quantity: float = 0.0
    min_stock_level: float = 0.0
    reorder_level: float = 0.0
    reorder_quantity: float = 0.0
    hs_code: Optional[str] = None
    tax_rate: Optional[str] = None
    uom: Optional[str] = None
    sale_type: Optional[str] = None
    sro_schedule_no: Optional[str] = None
    is_fed_applicable: bool = False
    fed_rate: float = 0.0
    is_active: bool = True
    is_taxable: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    sku: Optional[str] = None
    name: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True   # for Pydantic v2