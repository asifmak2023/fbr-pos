"""Validation for immutable PRAL sandbox scenario examples."""
from typing import Any, Dict, List

BASE_FIELDS = {"invoiceType", "invoiceDate", "sellerNTNCNIC", "sellerBusinessName", "sellerProvince", "sellerAddress", "buyerNTNCNIC", "buyerBusinessName", "buyerProvince", "buyerAddress", "buyerRegistrationType", "invoiceRefNo", "scenarioId", "items"}
ITEM_FIELDS = {"hsCode", "productDescription", "rate", "uoM", "quantity", "totalValues", "valueSalesExcludingST", "fixedNotifiedValueOrRetailPrice", "salesTaxApplicable", "salesTaxWithheldAtSource", "extraTax", "furtherTax", "sroScheduleNo", "fedPayable", "discount", "saleType", "sroItemSerialNo"}


def validate_sandbox_payload(payload: Dict[str, Any], scenario: Any) -> List[str]:
    """Validate the documented shape without inventing tax calculations."""
    errors = []
    missing = sorted(field for field in BASE_FIELDS if field not in payload)
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
        missing = sorted(field for field in ITEM_FIELDS if field not in item)
        if missing:
            errors.append(f"Item {index} is missing: " + ", ".join(missing))
        for field in required:
            if not item.get(field):
                errors.append(f"Item {index} requires {field} for {scenario.scenario_code}")
        for field, expected in rules.items():
            if field in {"rate", "saleType"} and item.get(field) != expected:
                errors.append(f"Item {index} {field} must be {expected!r} for {scenario.scenario_code}")
    return errors
