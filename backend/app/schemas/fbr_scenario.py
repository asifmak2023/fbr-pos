from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime


class FBRScenarioBase(BaseModel):
    scenario_code: str = Field(..., description="FBR scenario code like SN001, SN002")
    name: str = Field(..., description="Human-readable scenario name")
    description: Optional[str] = None
    business_activity: Optional[str] = None
    sector: Optional[str] = None
    buyer_registration_type: Optional[str] = None
    requires_buyer_ntn: bool = False
    requires_reference_invoice: bool = False
    sample_invoice_data: Optional[Dict[str, Any]] = None
    enabled: bool = True
    test_status: str = "Not Tested"
    required_fields: Optional[List[str]] = None
    validation_rules: Optional[Dict[str, Any]] = None


class FBRScenarioCreate(FBRScenarioBase):
    pass


class FBRScenarioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    test_status: Optional[str] = None
    sample_invoice_data: Optional[Dict[str, Any]] = None
    required_fields: Optional[List[str]] = None
    validation_rules: Optional[Dict[str, Any]] = None


class FBRScenarioResponse(FBRScenarioBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class FBRScenarioTestRequest(BaseModel):
    scenario_code: str
    use_sample_data: bool = True
    custom_invoice_data: Optional[Dict[str, Any]] = None


class FBRScenarioTestResponse(BaseModel):
    scenario_code: str
    test_invoice_data: Dict[str, Any]
    fbr_response: Optional[Dict[str, Any]] = None
    test_status: str
    error_message: Optional[str] = None
    fbr_invoice_number: Optional[str] = None
    submission_timestamp: Optional[datetime] = None