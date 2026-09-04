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
    FBRScenarioTestResponse,
)
from app.routes.auth import get_current_user
from app.services.fbr_client import FBRClient
from app.services.fbr_scenario_validation import validate_sandbox_payload
import logging
import os
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/fbr-scenarios", tags=["fbr-scenarios"])


# ---------------------------------------------------------------------------
# Static / collection routes  (must come before /{scenario_code} wildcards)
# ---------------------------------------------------------------------------

@router.get("/", response_model=List[FBRScenarioResponse])
def list_scenarios(
    skip: int = 0,
    limit: int = 100,
    enabled_only: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all FBR scenarios"""
    query = db.query(FBRScenario)
    if enabled_only:
        query = query.filter(FBRScenario.enabled == True)
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=FBRScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(
    scenario: FBRScenarioCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new FBR scenario configuration"""
    if db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario.scenario_code).first():
        raise HTTPException(status_code=400, detail=f"Scenario {scenario.scenario_code} already exists")
    new_scenario = FBRScenario(**scenario.dict())
    db.add(new_scenario)
    db.commit()
    db.refresh(new_scenario)
    return new_scenario


@router.get("/status/summary")
def get_test_status_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get the stored sandbox test status for every scenario."""
    scenarios = db.query(FBRScenario).all()
    return {
        "total": len(scenarios),
        "not_tested": sum(1 for s in scenarios if s.test_status == "Not Tested"),
        "passed": sum(1 for s in scenarios if s.test_status == "Passed"),
        "failed": sum(1 for s in scenarios if s.test_status == "Failed"),
        "scenarios": [
            {"scenario_code": s.scenario_code, "name": s.name, "test_status": s.test_status}
            for s in scenarios
        ],
    }


# NOTE: /test and /test-all are declared HERE – before /{scenario_code} – so
# FastAPI never mistakes them for a scenario_code path parameter.

@router.post("/test", response_model=FBRScenarioTestResponse)
def test_scenario(
    test_request: FBRScenarioTestRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Submit a single scenario's sample invoice to the FBR sandbox."""
    scenario = db.query(FBRScenario).filter(
        FBRScenario.scenario_code == test_request.scenario_code
    ).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {test_request.scenario_code} not found")
    if not scenario.enabled:
        raise HTTPException(status_code=400, detail=f"Scenario {test_request.scenario_code} is disabled")
    if os.getenv("FBR_ENV", "sandbox").lower() != "sandbox":
        raise HTTPException(status_code=400, detail="Sandbox testing requires FBR_ENV=sandbox")

    if test_request.use_sample_data:
        if not scenario.sample_invoice_data:
            raise HTTPException(status_code=400, detail="No sample invoice data for this scenario")
        invoice_data = scenario.sample_invoice_data
    else:
        if not test_request.custom_invoice_data:
            raise HTTPException(status_code=400, detail="custom_invoice_data required")
        invoice_data = test_request.custom_invoice_data

    validation_errors = validate_sandbox_payload(invoice_data, scenario)
    if validation_errors:
        raise HTTPException(status_code=422, detail=validation_errors)

    return _submit_and_record(scenario, invoice_data, db)


@router.post("/test-all")
def test_all_scenarios(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Submit every enabled, not-yet-passed scenario to the FBR sandbox in sequence.

    Returns a list of per-scenario results so the frontend can show exactly what
    happened for each one without another round-trip.
    """
    if os.getenv("FBR_ENV", "sandbox").lower() != "sandbox":
        raise HTTPException(status_code=400, detail="Sandbox testing requires FBR_ENV=sandbox")

    scenarios = (
        db.query(FBRScenario)
        .filter(FBRScenario.enabled == True, FBRScenario.test_status != "Passed")
        .order_by(FBRScenario.scenario_code)
        .all()
    )

    results = []
    for scenario in scenarios:
        if not scenario.sample_invoice_data:
            results.append({
                "scenario_code": scenario.scenario_code,
                "name": scenario.name,
                "test_status": "Failed",
                "error_message": "No sample invoice data configured",
            })
            continue

        validation_errors = validate_sandbox_payload(scenario.sample_invoice_data, scenario)
        if validation_errors:
            results.append({
                "scenario_code": scenario.scenario_code,
                "name": scenario.name,
                "test_status": "Failed",
                "error_message": "Validation: " + "; ".join(validation_errors),
            })
            continue

        try:
            result = _submit_and_record(scenario, scenario.sample_invoice_data, db)
            results.append({
                "scenario_code": scenario.scenario_code,
                "name": scenario.name,
                "test_status": result.test_status,
                "fbr_invoice_number": result.fbr_invoice_number,
                "error_message": result.error_message,
                "fbr_response": result.fbr_response,
                "submission_timestamp": result.submission_timestamp,
            })
        except Exception as exc:
            results.append({
                "scenario_code": scenario.scenario_code,
                "name": scenario.name,
                "test_status": "Failed",
                "error_message": str(exc),
            })

    passed = sum(1 for r in results if r["test_status"] == "Passed")
    return {
        "submitted": len(results),
        "passed": passed,
        "failed": len(results) - passed,
        "results": results,
    }


# ---------------------------------------------------------------------------
# Per-scenario CRUD  (wildcard routes – must come LAST)
# ---------------------------------------------------------------------------

@router.get("/{scenario_code}", response_model=FBRScenarioResponse)
def get_scenario(
    scenario_code: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_code} not found")
    return scenario


@router.put("/{scenario_code}", response_model=FBRScenarioResponse)
def update_scenario(
    scenario_code: str,
    scenario_data: FBRScenarioUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
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
    current_user=Depends(get_current_user),
):
    scenario = db.query(FBRScenario).filter(FBRScenario.scenario_code == scenario_code).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_code} not found")
    db.delete(scenario)
    db.commit()


# ---------------------------------------------------------------------------
# Shared helper
# ---------------------------------------------------------------------------

def _extract_fbr_error(fbr_response: dict) -> str:
    """Pull the most useful error string out of whatever FBR returned.

    FBR uses several different field names across scenarios/versions, so we
    check them all and fall back to dumping the entire response as JSON so
    nothing is ever silently swallowed.
    """
    import json as _json
    for key in ("message", "error", "errors", "description", "detail",
                "errorDescription", "errorMessage", "rawBody"):
        val = fbr_response.get(key)
        if val:
            return str(val)[:1000]
    # Nothing useful found – return the whole response so the developer can see it
    try:
        return _json.dumps(fbr_response, ensure_ascii=False)[:1000]
    except Exception:
        return str(fbr_response)[:1000]


def _submit_and_record(
    scenario: FBRScenario,
    invoice_data: dict,
    db: Session,
) -> FBRScenarioTestResponse:
    """Send invoice_data to FBR, persist a submission record, update scenario status."""
    # _post_to_fbr no longer raises – it always returns a dict
    fbr_client = FBRClient()
    fbr_response = fbr_client.post_invoice_data(invoice_data)

    success = "invoiceNumber" in fbr_response
    new_status = "Passed" if success else "Failed"
    error_msg = None if success else _extract_fbr_error(fbr_response)

    logger.info(
        "FBR scenario %s → %s | HTTP %s | invoiceNumber=%s | error=%s",
        scenario.scenario_code, new_status,
        fbr_response.get("httpStatus", "?"),
        fbr_response.get("invoiceNumber"),
        error_msg,
    )

    _record_submission(
        db, scenario, invoice_data, fbr_response, new_status,
        fbr_invoice_number=fbr_response.get("invoiceNumber"),
        fbr_status_code=fbr_response.get("statusCode"),
        fbr_error_code=fbr_response.get("errorCode"),
        error=error_msg,
    )
    scenario.test_status = new_status
    scenario.updated_at = datetime.utcnow()
    db.commit()

    return FBRScenarioTestResponse(
        scenario_code=scenario.scenario_code,
        test_invoice_data=invoice_data,
        fbr_response=fbr_response,
        test_status=new_status,
        fbr_invoice_number=fbr_response.get("invoiceNumber"),
        error_message=error_msg,
        submission_timestamp=datetime.utcnow(),
    )


def _record_submission(
    db: Session,
    scenario: FBRScenario,
    invoice_data: dict,
    fbr_response,
    sub_status: str,
    *,
    fbr_invoice_number=None,
    fbr_status_code=None,
    fbr_error_code=None,
    error=None,
):
    sub = FBRSubmission(
        scenario_id=scenario.scenario_code,
        request_payload=invoice_data,
        response_payload=fbr_response,
        http_status=(fbr_response or {}).get("httpStatus", 200 if sub_status == "Success" else 400),
        submission_status=sub_status,
        fbr_invoice_number=fbr_invoice_number,
        fbr_status_code=fbr_status_code,
        fbr_error_code=fbr_error_code,
        fbr_error_message=error,
        attempt_count=1,
        responded_at=datetime.utcnow(),
    )
    db.add(sub)
