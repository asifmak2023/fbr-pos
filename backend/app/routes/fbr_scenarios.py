from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.fbr_scenario import FBRScenario
from app.models.fbr_submission import FBRSubmission
from app.schemas.fbr_scenario import (
    FBRScenarioCreate, 
    FBRScenarioUpdate, 
    FBRScenarioResponse,
    FBRScenarioTestRequest,
    FBRScenarioTestResponse
)
from app.routes.auth import get_current_user
from app.services.fbr_client import FBRClient
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/fbr-scenarios", tags=["fbr-scenarios"])


@router.post("/", response_model=FBRScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(
    scenario: FBRScenarioCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new FBR scenario configuration"""
    existing = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario.scenario_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Scenario {scenario.scenario_code} already exists")
    
    new_scenario = FBRScenario(**scenario.dict())
    db.add(new_scenario)
    db.commit()
    db.refresh(new_scenario)
    return new_scenario


@router.get("/", response_model=List[FBRScenarioResponse])
def list_scenarios(
    skip: int = 0,
    limit: int = 100,
    enabled_only: bool = False,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all FBR scenarios"""
    query = db.query(FBRScenario)
    if enabled_only:
        query = query.filter(FBRScenario.enabled == True)
    scenarios = query.offset(skip).limit(limit).all()
    return scenarios


@router.get("/{scenario_code}", response_model=FBRScenarioResponse)
def get_scenario(
    scenario_code: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific FBR scenario by code"""
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_code} not found")
    return scenario


@router.put("/{scenario_code}", response_model=FBRScenarioResponse)
def update_scenario(
    scenario_code: str,
    scenario_data: FBRScenarioUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update an FBR scenario"""
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_code} not found")
    
    for key, value in scenario_data.dict(exclude_unset=True).items():
        setattr(scenario, key, value)
    
    db.commit()
    db.refresh(scenario)
    return scenario


@router.delete("/{scenario_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scenario(
    scenario_code: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete an FBR scenario"""
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_code} not found")
    
    db.delete(scenario)
    db.commit()
    return None


@router.post("/test", response_model=FBRScenarioTestResponse)
def test_scenario(
    test_request: FBRScenarioTestRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Test a scenario by submitting sample invoice to FBR sandbox"""
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == test_request.scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {test_request.scenario_code} not found")
    
    if not scenario.enabled:
        raise HTTPException(status_code=400, detail=f"Scenario {test_request.scenario_code} is not enabled")
    
    # Get invoice data (either sample or custom)
    if test_request.use_sample_data:
        if not scenario.sample_invoice_data:
            raise HTTPException(status_code=400, detail="No sample invoice data available for this scenario")
        invoice_data = scenario.sample_invoice_data
    else:
        if not test_request.custom_invoice_data:
            raise HTTPException(status_code=400, detail="Custom invoice data required when not using sample data")
        invoice_data = test_request.custom_invoice_data
    
    # Submit to FBR
    try:
        fbr_client = FBRClient()
        fbr_response = fbr_client.post_invoice_data(invoice_data)
        
        # Create FBR submission record for scenario test
        fbr_submission = FBRSubmission(
            scenario_id=test_request.scenario_code,
            request_payload=invoice_data,
            response_payload=fbr_response,
            http_status=200 if "invoiceNumber" in fbr_response else 400,
            attempt_count=1
        )
        
        # Update scenario test status based on response
        if "invoiceNumber" in fbr_response:
            scenario.test_status = "Passed"
            scenario.updated_at = datetime.utcnow()
            fbr_submission.submission_status = "Success"
            fbr_submission.fbr_invoice_number = fbr_response.get("invoiceNumber")
            fbr_submission.fbr_status_code = fbr_response.get("statusCode", "00")
            fbr_submission.responded_at = datetime.utcnow()
            db.add(fbr_submission)
            db.commit()
            
            return FBRScenarioTestResponse(
                scenario_code=test_request.scenario_code,
                test_invoice_data=invoice_data,
                fbr_response=fbr_response,
                test_status="Passed",
                fbr_invoice_number=fbr_response.get("invoiceNumber"),
                submission_timestamp=datetime.utcnow()
            )
        else:
            scenario.test_status = "Failed"
            scenario.updated_at = datetime.utcnow()
            fbr_submission.submission_status = "Failed"
            fbr_submission.fbr_status_code = fbr_response.get("statusCode", "99")
            fbr_submission.fbr_error_code = fbr_response.get("errorCode")
            fbr_submission.fbr_error_message = fbr_response.get("error", "Unknown FBR error")
            fbr_submission.responded_at = datetime.utcnow()
            db.add(fbr_submission)
            db.commit()
            
            return FBRScenarioTestResponse(
                scenario_code=test_request.scenario_code,
                test_invoice_data=invoice_data,
                fbr_response=fbr_response,
                test_status="Failed",
                error_message=fbr_response.get("error", "Unknown FBR error"),
                submission_timestamp=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"FBR scenario test failed: {e}")
        scenario.test_status = "Failed"
        scenario.updated_at = datetime.utcnow()
        
        # Create failed submission record
        fbr_submission = FBRSubmission(
            scenario_id=test_request.scenario_code,
            submission_status="Failed",
            fbr_error_message=str(e),
            responded_at=datetime.utcnow()
        )
        db.add(fbr_submission)
        db.commit()
        
        return FBRScenarioTestResponse(
            scenario_code=test_request.scenario_code,
            test_invoice_data=invoice_data,
            test_status="Failed",
            error_message=str(e),
            submission_timestamp=datetime.utcnow()
        )


@router.get("/status/summary")
def get_test_status_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get summary of all scenario test statuses"""
    scenarios = db.query(FBRScenario).all()
    
    summary = {
        "total": len(scenarios),
        "not_tested": len([s for s in scenarios if s.test_status == "Not Tested"]),
        "passed": len([s for s in scenarios if s.test_status == "Passed"]),
        "failed": len([s for s in scenarios if s.test_status == "Failed"]),
        "scenarios": [
            {
                "scenario_code": s.scenario_code,
                "name": s.name,
                "test_status": s.test_status
            }
            for s in scenarios
        ]
    }
    
    return summary