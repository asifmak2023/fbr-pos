# FBR SCENARIOS AND RULES

**Project:** FBR-POS Digital Invoicing System  
**Document:** FBR Scenarios and Rules  
**Version:** 1.0  
**Date:** 16 August 2026  
**Status:** Working implementation specification

## 1. Purpose

This document defines how our POS determines and validates the FBR Digital Invoicing scenario before constructing an FBR API request.

The central rule is:

> The cashier should select business information, not invent FBR API codes.

```text
Sale
 ↓
Business Context
 ↓
Buyer Context
 ↓
Product/Tax Context
 ↓
Scenario Rules
 ↓
Scenario ID
 ↓
Validation
 ↓
FBR Payload
```

## 2. Official API Evidence

The current FBR Digital Invoicing API specification shows `scenarioId` as a required invoice-header field. Its sandbox example uses `SN001`. The same specification states that `invoiceRefNo` is required for debit/credit notes. citeturn0search13turn0search12

The published item model includes fields such as:

```text
hsCode
productDescription
rate
uoM
quantity
totalValues
valueSalesExcludingST
fixedNotifiedValueOrRetailPrice
salesTaxApplicable
salesTaxWithheldAtSource
extraTax
furtherTax
sroScheduleNo
fedPayable
discount
saleType
sroItemSerialNo
```

citeturn0search12

## 3. Invoice Type ≠ Scenario ≠ Sale Type

These are separate concepts:

```text
invoiceType
    = Sale Invoice

scenarioId
    = SN001

saleType
    = Goods at standard rate (default)
```

They must not be collapsed into one database field.

## 4. Scenario ID

`scenarioId` is a controlled value.

Recommended internal structure:

```text
fbr_scenarios
-------------
id
scenario_code
name
description
invoice_type
buyer_type
requires_reference_invoice
active
```

The cashier must never manually type the scenario ID.

## 5. Confirmed Scenario

The currently published API example confirms:

| Scenario | Code | Status |
|---|---|---|
| Official sandbox sale example | `SN001` | Confirmed in published API example |

We will not assume this is the only production scenario.

**Never invent additional scenario IDs.**

## 6. Scenario Determination

The system should determine the scenario from:

```text
Invoice type
+
Buyer registration type
+
Buyer identity
+
Product/tax classification
+
Sale type
+
Reference document
+
Applicable FBR rules
```

Conceptually:

```python
scenario = scenario_engine.determine(invoice_context)
```

## 7. Standard Sale

Conceptual workflow:

```text
New Sale
   ↓
Customer identified
   ↓
Products selected
   ↓
Tax classification determined
   ↓
Sale type determined
   ↓
Scenario determined
   ↓
Validation
   ↓
FBR payload
```

The exact scenario ID must come from the current FBR scenario/reference material.

## 8. Buyer Registration Type

The API sample contains `buyerRegistrationType` and uses `Registered`. citeturn0search13

Internally use controlled values, for example:

```text
REGISTERED
UNREGISTERED
OTHER_ALLOWED_TYPE
```

The final allowed values must be synchronized with current FBR reference data.

## 9. Buyer Identity

The validation engine must distinguish:

```text
Buyer known?
Buyer identification required?
NTN/CNIC available?
Registration type known?
```

The exact required fields depend on the scenario.

## 10. Seller Identity

Seller information should come from:

```text
Business
   ↓
Branch
   ↓
POS Terminal
```

The application should validate the configured seller profile before submission.

## 11. Invoice Date

The API example uses:

```text
YYYY-MM-DD
```

The backend must validate the date, business timezone and applicable transaction/supply rules.

## 12. Reference Invoice

The published specification explicitly states that:

```text
invoiceRefNo
```

is required for debit/credit notes. citeturn0search12

Our model should therefore support:

```text
invoices.reference_invoice_id
```

while keeping the FBR reference field separate.

## 13. Debit and Credit Notes

Conceptually:

```text
Original Invoice
      ↓
Credit Note
```

or:

```text
Original Invoice
      ↓
Debit Note
```

Before submission:

```text
Original invoice exists
        ↓
Reference is valid
        ↓
Applicable scenario supports document
        ↓
invoiceRefNo populated
        ↓
Validation
        ↓
Submission
```

FBR's FAQ states that cancellation of supply, return of goods, change in supply, or change in supply value can lead to debit/credit-note treatment subject to applicable conditions and limitations. citeturn0search6

## 14. Product Classification

Our product master must support:

```text
SKU
name
description
HS code
unit of measure
sale type
tax classification
tax rate
SRO information where applicable
```

## 15. HS Code

The published item model includes `hsCode` and describes its applicability to manufacturer-cum-retailer electronic invoices. citeturn0search12

Therefore:

```text
products.hs_code
```

must be supported.

HS code must not be the product primary key.

## 16. Same HS Code, Different SKUs

FBR's current FAQ specifically notes that multiple SKUs can share an HS code while having different sale/purchase types and therefore different tax treatment. It recommends distinct descriptions for such SKUs. citeturn0search6

Therefore:

```text
HS Code
   ≠
Product Identity
   ≠
Sale Type
```

## 17. Sale Type

The published item model contains `saleType`, with the example:

```text
Goods at standard rate (default)
```

citeturn0search12

Sale types should be controlled reference data, not arbitrary cashier text.

## 18. Tax Components

The FBR item model contains:

```text
valueSalesExcludingST
salesTaxApplicable
salesTaxWithheldAtSource
extraTax
furtherTax
fedPayable
discount
```

citeturn0search12

Our internal tax engine must calculate these from applicable business/tax rules.

The frontend must not be the authoritative tax calculator.

## 19. Rate

The API example represents the tax rate as a string such as:

```text
18%
```

citeturn0search12

Internally, store a normalized numerical rate such as:

```text
18.00
```

and let the FBR mapper generate the required external representation.

## 20. Quantity

The published item schema marks quantity as required. citeturn0search12

Our internal model should support decimal quantities where the unit permits them:

```text
1 piece
2 pieces
1.500 kg
0.750 liter
```

The final FBR transformation must follow the applicable API type/rules.

## 21. Unit of Measure

The item model includes:

```text
uoM
```

The documentation provides examples such as `KG` and `Numbers, pieces, units`. citeturn0search12turn0search15

Maintain a controlled UOM catalogue.

## 22. Discount

Discount must be calculated by the backend.

Conceptually:

```text
Gross line value
       ↓
Discount
       ↓
Taxable value
       ↓
Tax
       ↓
Final value
```

Exact tax treatment must follow applicable tax rules.

## 23. Further Tax and Extra Tax

The API contains:

```text
furtherTax
extraTax
```

as optional item fields. citeturn0search12

These should be calculated by the tax engine based on eligibility rules, not typed by the cashier.

## 24. Sales Tax Withheld at Source

The API includes:

```text
salesTaxWithheldAtSource
```

citeturn0search12

It must remain separate from ordinary sales tax in our internal model.

## 25. FED

The API contains:

```text
fedPayable
```

citeturn0search12

FED must remain separately identifiable from sales tax.

## 26. SRO Information

The API includes:

```text
sroScheduleNo
sroItemSerialNo
```

as optional item fields. citeturn0search12

Our product/tax configuration must support them when applicable without making them universal requirements.

## 27. Fixed/Notified Value or Retail Price

The API contains:

```text
fixedNotifiedValueOrRetailPrice
```

This must be represented separately from ordinary selling price because the two can have different fiscal meanings.

## 28. Scenario Validation Engine

Recommended architecture:

```text
ScenarioEngine
     |
     +-- determine()
     +-- validate_header()
     +-- validate_buyer()
     +-- validate_items()
     +-- validate_tax()
     +-- validate_reference()
```

All scenario-specific rules belong in the backend.

## 29. Validation Result

Use a structured result:

```text
ValidationResult
----------------
valid
scenario_id
errors[]
warnings[]
```

Example:

```json
{
  "valid": false,
  "scenario_id": "SN001",
  "errors": [
    {
      "field": "buyerNTNCNIC",
      "code": "BUYER_ID_REQUIRED",
      "message": "Buyer identification is required for this scenario."
    }
  ]
}
```

## 30. Frontend Role

The frontend can assist:

```text
Customer selected
      ↓
Show relevant fields
      ↓
Product selected
      ↓
Show tax information
      ↓
Backend determines scenario
      ↓
Backend validates
      ↓
Submit
```

Backend validation remains authoritative.

## 31. No Hard-Coded Scenario Logic in Angular

Avoid scattering:

```typescript
if (scenario === "SN001") {
    ...
}
```

through components.

Prefer:

```text
Angular
   ↓
Backend rules/metadata
   ↓
Dynamic UI
```

This reduces frontend changes when FBR rules change.

## 32. Scenario Configuration Versioning

FBR rules may change.

Recommended fields:

```text
rule_version
effective_from
effective_to
active
```

This supports auditability.

## 33. Auditability

For every submitted invoice we should be able to determine:

```text
Which scenario?
Which rules?
Which tax configuration?
Which product data?
Who created it?
When submitted?
What did FBR return?
```

Therefore we need:

```text
fbr_scenarios
fbr_scenario_rules
fbr_submissions
audit_logs
```

## 34. Time of Supply

FBR's current FAQ states that digital invoices are issued at the time of supply, i.e. the earlier of receipt of payment or delivery of goods under the applicable rule. citeturn0search6

The application should therefore distinguish, where relevant:

```text
invoice creation time
payment time
delivery/supply time
invoice date
```

We should not blindly equate invoice date with the application timestamp.

## 35. Local and Export Sales

FBR's FAQ states that digital invoicing applies to sales required to be reported in Annexure-C, including export sales. citeturn0search6

The architecture should therefore support both:

```text
Local Sale
Export Sale
```

where applicable.

## 36. Cancellation and Fiscal Immutability

Once an invoice has been successfully submitted:

```text
Invoice
   ↓
FBR Submitted
```

ordinary users should not simply edit or delete its fiscal data.

Corrections should follow the applicable cancellation/debit/credit workflow.

Maintain:

```text
Original Invoice
Correction Event
FBR Submission
FBR Response
User
Timestamp
Reason
```

## 37. Separate Rule Engines

Do not put every rule into the scenario engine.

Keep:

```text
Scenario Engine
Tax Engine
Invoice Engine
FBR Mapper
```

separate.

Architecture:

```text
Business Rules
      ↓
Scenario Engine
      ↓
Tax Engine
      ↓
Invoice Engine
      ↓
FBR Mapper
      ↓
FBR API
```

## 38. Proposed Rule Evaluation Order

```text
1. Validate seller
        ↓
2. Validate invoice type
        ↓
3. Determine buyer context
        ↓
4. Validate buyer
        ↓
5. Validate products
        ↓
6. Determine sale type
        ↓
7. Determine tax rules
        ↓
8. Determine FBR scenario
        ↓
9. Validate scenario requirements
        ↓
10. Calculate totals
        ↓
11. Build FBR payload
        ↓
12. FBR validation where applicable
        ↓
13. Submit
```

This ordering can be refined during implementation.

## 39. Current Confirmed Scenario Information

At this stage:

```text
SN001
```

is confirmed as the scenario identifier used in the official published API sandbox example. citeturn0search13

We will not assume it is the only production scenario.

The complete catalogue must be extracted from current FBR reference material and the selected licensed integrator.

## 40. What We Must Not Assume

Do not assume:

```text
SN001 = every normal sale
buyerNTNCNIC = always mandatory
invoiceRefNo = always required
HS code alone determines tax
same HS code = same tax treatment
HTTP 200 = invoice accepted
API sample = complete production rulebook
```

These distinctions are essential.

## 41. Database Consequences

The scenario/rule analysis requires support for:

```text
businesses
branches
pos_terminals

contacts

products
product_tax_rules
units_of_measure

invoices
invoice_items
invoice_references

tax_rules
tax_components

fbr_scenarios
fbr_scenario_rules

fbr_submissions
fbr_response_errors

audit_logs
```

## 42. Next Document

The next document is:

```text
docs/FBR_ERROR_CODES.md
```

It will define:

```text
FBR Error
    ↓
Error Category
    ↓
Retryable?
    ↓
User Message
    ↓
Operator Action
    ↓
Audit Record
```

Then:

```text
FBR_INVOICE_LIFECYCLE.md
        ↓
DATABASE_SCHEMA.md
        ↓
API_ARCHITECTURE.md
        ↓
Implementation
```

## 43. Implementation Gate

```text
✓ Project Requirements
✓ FBR Integration Specification
✓ FBR API Field Mapping
✓ FBR Scenarios and Rules
→ FBR Error Codes
→ FBR Invoice Lifecycle
→ Database Schema
→ API Architecture
→ Backend
→ Sandbox
→ Frontend
```

Once the database schema is frozen, we can start creating the actual SQLAlchemy models and FastAPI endpoints.

## 44. Core Principle

> **The user selects business facts. The system determines the fiscal rules. The FBR mapper produces the external API representation.**

This principle should remain unchanged throughout the project.

## 45. Official References

- urlFBR Digital Invoicing Technical Assistancehttps://www.fbr.gov.pk/di-technical-assistance/173967/173970
- urlFBR Digital Invoicing API Technical Documentationhttps://download1.fbr.gov.pk/Docs/20257301172130815TechnicalDocumentationforDIAPIV1.12.pdf
- urlFBR Digital Invoicing FAQshttps://www.fbr.gov.pk/faqs/173967/173969
- urlFBR Licensed Integratorshttps://fbr.gov.pk/list-of-license-interprator/173967/173971
