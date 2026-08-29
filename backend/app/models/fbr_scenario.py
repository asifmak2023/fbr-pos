from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class FBRScenario(Base):
    __tablename__ = "fbr_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    scenario_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Business context
    business_activity = Column(String(100), nullable=True)
    sector = Column(String(100), nullable=True)
    
    # Scenario requirements
    buyer_registration_type = Column(String(50), nullable=True)
    requires_buyer_ntn = Column(Boolean, default=False)
    requires_reference_invoice = Column(Boolean, default=False)
    
    # Official sample data (from FBR documentation)
    sample_invoice_data = Column(JSON, nullable=True)
    
    # Status
    enabled = Column(Boolean, default=True)
    test_status = Column(String(20), default="Not Tested")  # Not Tested, Passed, Failed
    
    # Validation rules (JSON format)
    required_fields = Column(JSON, nullable=True)
    validation_rules = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<FBRScenario {self.scenario_code}: {self.name}>"