"""Validation for immutable PRAL sandbox scenario examples."""
from typing import Any, Dict, List

# buyerRegistrationType is OPTIONAL – SN011 (Toll Manufacturing) omits it per the PDF.
REQUIRED_BASE_FIELDS = {
    "invoiceType", "invoiceDate", "sellerNTNCNIC", "sellerBusinessName",
    "sellerProvince", "sellerAddress", "buyerNTNCNIC", "buyerBusinessName",
    "buyerProvince", "buyerAddress", "invoiceRefNo", "scenarioId", "items",
}

# valueSalesExcludingST is intentionally absent for MRP-based scenarios
# (SN008, SN027, SN028) where tax is on fixedNotifiedValueOrRetailPrice.
REQUIRED_ITEM_FIELDS = {
    "hsCode", "productDescription", "rate", "uoM", "quantity", "totalValues",
    "fixedNotifiedValueOrRetailPrice", "salesTaxApplicable",
    "salesTaxWithheldAtSource", "extraTax", "furtherTax", "sroScheduleNo",
    "fedPayable", "discount", "saleType", "sroItemSerialNo",
}


def validate_sandbox_payload(payload: Dict[str, Any], scenario: Any) -> List[str]:
    """Validate the documented shape without inventing tax calculations."""
    errors = []
    missing = sorted(field for field in REQUIRED_BASE_FIELDS if field not in payload)
    if missing:
        errors.append("Missing invoice fields: " + ", ".join(missing))
    if payload.get("scenarioId") != scenario.scenario_code:
        errors.append("scenarioId must match the selected scenario")
    items = payload.get("items")
    if not isinstance(items, list) or not items:
        return errors + ["At least one invoice item is required"]
    required = set(scenario.required_fields or [])
    rules = scenario.validation_rules or {}
    for index, item in enumerate(items, 1):
        missing = sorted(field for field in REQUIRED_ITEM_FIELDS if field not in item)
        if missing:
            errors.append(f"Item {index} is missing: " + ", ".join(missing))
        for field in required:
            if not item.get(field):
                errors.append(f"Item {index} requires {field} for {scenario.scenario_code}")
        for field, expected in rules.items():
            if field in {"rate", "saleType"} and item.get(field) != expected:
                errors.append(f"Item {index} {field} must be {expected!r} for {scenario.scenario_code}")
    return errors
