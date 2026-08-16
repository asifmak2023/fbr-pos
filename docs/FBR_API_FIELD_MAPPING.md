# FBR API Field Mapping
## Official Digital Invoicing API — Working Integration Specification

**Project:** FBR-POS Digital Invoicing System  
**Document:** FBR API Field Mapping  
**Version:** 1.0  
**Date:** 16 August 2026  
**Status:** Working specification; production implementation must be verified against the current FBR-approved integration contract.

## 1. Purpose

This document converts the current official FBR Digital Invoicing API material into an implementation-oriented mapping for our application.

The objective is not to copy FBR JSON directly into our database. Instead, we establish a controlled boundary:

```text
Business Data
     ↓
Internal Invoice Model
     ↓
Pydantic Schema
     ↓
FBR Mapper
     ↓
FBR API Payload
     ↓
FBR Response
     ↓
Internal Fiscal Status
```

FBR's official technical-assistance page provides the Digital Invoicing API documentation, and the published specification describes Digital Invoicing API methods including `postinvoicedata` and `validateinvoicedata`. citeturn0search2turn0search28

## 2. Regulatory Boundary

Our application is a POS/invoicing application. Building it does not by itself make us an FBR licensed integrator.

FBR's current FAQ states that notified registered persons must integrate their POS, ERP or other invoicing system through a licensed integrator with a valid FBR license. FBR also publishes the current list of licensed integrators. citeturn0search3turn0search0

Therefore:

```text
FBR-POS Application
        ↓
Approved Licensed-Integrator Arrangement
        ↓
FBR Digital Invoicing
```

Production configuration must be finalized with the selected licensed integrator.

## 3. Current API Endpoint

The currently published technical specification identifies:

```text
POST
https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata
```

The same specification states that the URL remains the same for sandbox and production routing, with routing based on the security token being used. citeturn0search28

This means these must be configuration values:

```text
FBR_ENVIRONMENT
FBR_API_URL
FBR_SECURITY_TOKEN
FBR_TIMEOUT
```

They must not be hard-coded throughout the application.

## 4. API Methods

The published specification describes:

```text
postinvoicedata
validateinvoicedata
```

Our service layer should keep these operations separate:

```python
class FBRClient:
    async def post_invoice(...):
        ...

    async def validate_invoice(...):
        ...
```

The final request and response models must follow the currently approved FBR specification.

## 5. Security Token

The FBR security token belongs exclusively on the backend.

Never:

- hard-code it in Python source;
- commit it to Git;
- place it in Angular source;
- expose it to browser JavaScript;
- print it in logs;
- return it through ordinary API endpoints.

Development can use environment variables. Production should preferably use a proper secret-management mechanism.

## 6. Invoice Header

The current published API specification shows invoice header properties including:

```text
invoiceType
invoiceDate
sellerNTNCNIC
sellerBusinessName
sellerProvince
sellerAddress
buyerNTNCNIC
buyerBusinessName
buyerProvince
buyerAddress
buyerRegistrationType
invoiceRefNo
scenarioId
```

The specification explicitly shows these fields in its sample `postinvoicedata` request. citeturn0search28turn0search12

## 7. Header Mapping

| FBR Field | Internal Concept | Type | Requirement | Implementation |
|---|---|---|---|---|
| `invoiceType` | Invoice type | string/enum | Scenario-dependent | Controlled value |
| `invoiceDate` | Invoice date | date | Required | Validate before submission |
| `sellerNTNCNIC` | Seller tax identity | string | Required/conditional | Normalize and validate |
| `sellerBusinessName` | Seller name | string | Required/conditional | Business/branch source |
| `sellerProvince` | Seller province | string | Required/conditional | Controlled value |
| `sellerAddress` | Seller address | string | Required/conditional | Business/branch source |
| `buyerNTNCNIC` | Buyer tax identity | string | Scenario-dependent | Normalize |
| `buyerBusinessName` | Buyer name | string | Scenario-dependent | Customer source |
| `buyerProvince` | Buyer province | string | Scenario-dependent | Controlled value |
| `buyerAddress` | Buyer address | string | Scenario-dependent | Customer source |
| `buyerRegistrationType` | Buyer registration status | enum | Scenario-dependent | Never free text |
| `invoiceRefNo` | Reference invoice | string | Scenario-dependent | Used only where applicable |
| `scenarioId` | FBR scenario | enum/string | Scenario-dependent | Controlled configuration |

The words `Required/conditional` mean that the requirement must be evaluated against the applicable FBR scenario. They do not mean the frontend can simply omit validation.

## 8. Seller Model

Seller information should exist at business/branch level:

```text
business
   |
   +-- branches
          |
          +-- pos_terminals
```

Mapping:

```text
Invoice
  ↓
POS Terminal
  ↓
Branch
  ↓
Business
  ↓
FBR Seller Fields
```

This allows one application to support multiple branches without hard-coding a seller.

## 9. Buyer Model

Buyer information should be maintained separately from seller information.

Recommended entity:

```text
contacts
```

It should support the buyer information required by the applicable FBR scenario.

The application must not assume that every buyer has identical identification requirements.

## 10. buyerRegistrationType

This field should not be a free-text input.

Use a controlled internal value:

```text
BuyerRegistrationType
```

Then map it to the exact FBR value.

This prevents variations such as:

```text
registered
Registered
REGISTERED
Reg.
```

from being accidentally submitted.

## 11. invoiceRefNo

Our normal internal invoice number is different from an FBR reference invoice number.

Maintain:

```text
invoice_number
```

for our application and:

```text
invoiceRefNo
```

only where the applicable FBR scenario requires a reference to another invoice/document.

This distinction will be important when implementing legally supported correction/reference workflows.

## 12. scenarioId

`scenarioId` must be treated as a controlled business concept.

Do not allow:

```text
scenarioId = arbitrary user input
```

Instead:

```text
Sale
 ↓
Determine applicable scenario
 ↓
Validate scenario requirements
 ↓
Assign scenarioId
 ↓
Build FBR payload
```

We will document the actual scenario catalogue in the next document:

```text
docs/FBR_SCENARIOS_AND_RULES.md
```

## 13. Items

The API request contains an item collection. The internal database should therefore use:

```text
invoice
   |
   +-- invoice_items
```

rather than storing the entire item array as an opaque JSON blob.

## 14. Internal Invoice Item

Initial internal model:

```text
invoice_items
------------
id
invoice_id
product_id
line_number
description
quantity
unit_of_measure
unit_price
gross_amount
discount_amount
tax_rate
tax_amount
net_amount
created_at
updated_at
```

Additional fields will be added where required by the complete FBR item contract.

## 15. FBR Item Mapping

The final mapping table must be populated directly from the exact current FBR item schema.

Working structure:

| Internal Field | FBR Field | Type | Requirement | Transformation |
|---|---|---|---|---|
| product code | FBR product/code field | string | Scenario-dependent | Normalize |
| description | FBR description field | string | Required/conditional | Trim/validate |
| quantity | FBR quantity field | decimal | Required | Decimal normalization |
| unit | FBR unit field | string | Required/conditional | Controlled UOM |
| unit price | FBR rate field | decimal | Required/conditional | Decimal |
| gross amount | FBR value field | decimal | Required/conditional | Backend calculation |
| discount | FBR discount field | decimal | Conditional | Backend calculation |
| tax rate | FBR tax-rate field | decimal | Conditional | Tax configuration |
| tax amount | FBR tax field | decimal | Conditional | Backend calculation |
| net amount | Applicable FBR value | decimal | Conditional | Backend calculation |

The exact FBR field names must be frozen from the approved specification before the SQLAlchemy models are finalized.

## 16. Backend Is Authoritative

The browser may display calculations, but the backend must recalculate and validate:

```text
quantity
price
discount
tax
subtotal
grand total
```

Correct flow:

```text
Angular
  ↓
Proposed invoice
  ↓
FastAPI
  ↓
Recalculate
  ↓
Validate
  ↓
Persist
  ↓
Generate FBR payload
```

Never blindly trust monetary totals sent by the browser.

## 17. Monetary Arithmetic

Use Python `Decimal` rather than binary floating-point arithmetic for money and tax calculations.

Conceptually:

```text
unit price × quantity
        ↓
Decimal calculation
        ↓
rounding policy
        ↓
tax calculation
        ↓
invoice total
```

The exact precision and rounding rules must follow the applicable FBR/business requirements.

## 18. Internal vs FBR Identifiers

Maintain independent identifiers:

```text
Internal Invoice ID
Internal Invoice Number
FBR Submission ID
FBR Invoice Number
FBR Reference Number
```

Example:

```text
Internal ID:
UUID/database ID

Invoice Number:
INV-2026-000001

FBR identifiers:
Stored separately after the FBR response
```

Never make an external FBR identifier the only primary key of our database.

## 19. FBR Submission Record

Recommended conceptual table:

```text
fbr_submissions
----------------
id
invoice_id
attempt_number
submission_status
request_hash
request_payload
response_payload
http_status
fbr_invoice_number
fbr_reference_number
error_code
error_message
submitted_at
responded_at
created_at
updated_at
```

Secrets must never be stored in this table.

## 20. Request Hash

A request hash can help detect accidental duplicate processing.

Concept:

```text
Canonical invoice data
        ↓
SHA-256
        ↓
request_hash
```

This is an internal integrity mechanism, not a replacement for FBR's own duplicate/reconciliation rules.

## 21. Response Processing

Never implement:

```text
HTTP 200 = automatically successful invoice
```

Instead:

```text
HTTP response
      ↓
Parse JSON
      ↓
Validate response schema
      ↓
Interpret FBR result
      ↓
Extract identifiers
      ↓
Update invoice status
      ↓
Create audit record
```

The exact acceptance/rejection semantics must follow the current FBR response contract.

## 22. Validation

The published specification includes a validation method.

Our integration layer should therefore support:

```text
Local validation
       ↓
FBR validation where applicable
       ↓
Submission
```

Whether validation is required, optional, or limited to particular workflows must be verified against the current approved integration process before production.

## 23. Error Model

Normalize external errors into:

```text
FBRIntegrationError
--------------------
code
message
category
retryable
raw_response
timestamp
```

Suggested categories:

```text
AUTHENTICATION
VALIDATION
BUSINESS_RULE
NETWORK
TIMEOUT
RATE_LIMIT
SERVER_ERROR
UNKNOWN
```

The frontend should receive a safe application-level message rather than raw internal diagnostics.

## 24. Retry Policy

Potentially retryable conditions:

```text
Temporary network failure
Timeout
Temporary server failure
```

Potentially non-retryable conditions:

```text
Invalid invoice data
Invalid taxpayer information
Invalid scenario
Authentication configuration failure
```

Exact classification must be verified against current FBR/integrator behavior.

Never retry indefinitely.

Use:

```text
Maximum attempts
+
Exponential backoff
+
Manual review state
```

## 25. Network Interruption

FBR's current FAQ addresses business interruptions and states that taxpayers and licensed integrators must comply with the applicable Sales Tax Act and Rules during such circumstances. citeturn0search3

Therefore the application needs an explicit interruption state:

```text
FBR unavailable
      ↓
Invoice locally recorded
      ↓
PENDING_FBR
      ↓
Visible to authorized operator
      ↓
Controlled submission/reconciliation
```

The exact legal handling of prolonged interruption must be verified with the applicable rules and licensed integrator.

## 26. Database Impact

The FBR mapping leads to these major entities:

```text
businesses
branches
pos_terminals

contacts

products
product_categories
units

invoices
invoice_items
payments

fbr_scenarios
fbr_submissions
fbr_errors

audit_logs
```

## 27. Proposed Invoice Entity

Working model:

```text
invoices
--------
id
business_id
branch_id
pos_terminal_id
cashier_id
customer_id

invoice_number
invoice_type
invoice_date

subtotal
discount_total
tax_total
grand_total

status
fbr_status
fbr_invoice_number
fbr_reference_number

created_at
updated_at
```

This is deliberately a working model. Final fields will be frozen after the scenario and item mapping is complete.

## 28. Proposed Invoice Item Entity

```text
invoice_items
-------------
id
invoice_id
product_id
line_number
description
quantity
unit_of_measure
unit_price
gross_amount
discount_amount
tax_rate
tax_amount
net_amount
created_at
updated_at
```

FBR-specific fields should be stored when they represent meaningful fiscal/audit data, not merely because they appeared in one API payload.

## 29. FBR Scenario Configuration

Recommended:

```text
fbr_scenarios
-------------
id
scenario_code
name
description
invoice_type
buyer_type
requires_buyer_ntn
requires_reference_invoice
active
created_at
updated_at
```

This allows:

```text
Scenario
   ↓
Rules
   ↓
Validation
   ↓
FBR payload
```

rather than scattering scenario-specific `if/else` statements throughout the code.

## 30. Pydantic Architecture

Use separate models for:

```text
Internal API request
Internal API response
FBR request
FBR response
```

Recommended:

```text
schemas/
├── invoice.py
├── invoice_item.py
├── customer.py
└── fbr.py
```

With:

```text
FBRInvoiceRequest
FBRInvoiceItem
FBRInvoiceResponse
FBRValidationResponse
FBRResponseError
```

Do not use SQLAlchemy database models as FBR API models.

## 31. FBR Mapper

Recommended responsibility:

```python
class FBRInvoiceMapper:

    def to_fbr_payload(self, invoice):
        ...

    def from_fbr_response(self, response):
        ...
```

This is the formal boundary between our internal business model and FBR's external model.

## 32. FBR Client

Recommended responsibilities:

```text
Build HTTP request
Attach authentication
Send request
Handle timeout
Handle HTTP transport errors
Return parsed response
```

The client should NOT:

- calculate tax;
- calculate invoice totals;
- access Angular;
- contain product business rules;
- decide which scenario applies.

## 33. Invoice Service

The invoice service should orchestrate:

```text
Validate invoice
Calculate totals
Save invoice
Create submission record
Call FBR service
Process response
Update status
Create audit event
```

## 34. Security Architecture

Correct:

```text
Angular → FastAPI → FBR
```

Incorrect:

```text
Angular → FBR
```

The browser must never receive:

```text
FBR token
database password
Redis credentials
server secrets
```

## 35. Logging

Safe:

```text
Invoice ID
Submission ID
HTTP status
FBR result
Processing time
```

Unsafe:

```text
FBR security token
Authorization header
Database password
```

Secrets must be redacted.

## 36. Testing Matrix

The integration test suite should eventually cover:

```text
Valid sale invoice
Invalid invoice date
Invalid seller identity
Invalid buyer identity
Missing required field
Invalid buyer registration type
Invalid scenario
Invalid item
Invalid quantity
Invalid rate
Invalid tax
Authentication failure
Timeout
Connection failure
FBR rejection
FBR acceptance
Duplicate submission
Retry
Malformed response
```

## 37. Sandbox

Development should use the official sandbox process.

```text
Local application
       ↓
FBR mapper
       ↓
FBR sandbox
       ↓
FBR response
       ↓
Response processor
       ↓
Local fiscal status
```

Production credentials must never be used for ordinary development.

## 38. Confirmed from Current Official Material

The current official sources establish that:

1. FBR provides a Digital Invoicing technical-assistance page.
2. FBR publishes Digital Invoicing API technical documentation.
3. The published API specification contains `postinvoicedata`.
4. The published specification identifies the FBR gateway URL.
5. The published request contains invoice header and item data.
6. A security-token mechanism is used for routing/authentication.
7. FBR requires notified registered persons to integrate through licensed integrators.
8. FBR publishes a current licensed-integrator list.
9. The current user manual describes the API integration workflow with the selected licensed integrator. citeturn0search2turn0search28turn0search0turn0search27

## 39. Items Requiring Formal Verification Before Production

We still need to freeze:

```text
Exact current API version
Complete item schema
All scenario IDs
All allowed enumerations
All mandatory/conditional rules
Complete response schema
Complete error-code catalogue
Validation endpoint behavior
Production credential process
Sandbox credential process
IP/network requirements
Retry/reconciliation behavior
Cancellation rules
Credit-note rules
Debit-note rules
Amendment rules
Offline/interruption rules
Licensed-integrator technical requirements
```

These must come from the current official documentation and the selected licensed integrator rather than assumptions.

## 40. Next Document

The next document is:

```text
docs/FBR_SCENARIOS_AND_RULES.md
```

It will define:

```text
Invoice type
     ↓
Applicable scenario
     ↓
Buyer requirements
     ↓
Seller requirements
     ↓
Item requirements
     ↓
Tax requirements
     ↓
Reference invoice requirements
     ↓
Validation rules
```

After that:

```text
FBR_ERROR_CODES.md
        ↓
FBR_INVOICE_LIFECYCLE.md
        ↓
DATABASE_SCHEMA.md
```

## 41. Implementation Gate

We should not freeze the final SQLAlchemy schema until these documents are complete:

```text
✓ Project Requirements
✓ FBR Integration Specification
✓ FBR API Field Mapping
→ FBR Scenarios and Rules
→ FBR Error Codes
→ FBR Invoice Lifecycle
→ Database Schema
```

After that gate, we move directly into implementation.

## 42. Architecture Principle

> **FBR is an external fiscal system. Our POS is our business system. The integration layer is the controlled boundary between them.**

Therefore:

```text
Business Rules
      ≠
FBR API Rules
      ≠
Database
      ≠
Frontend
```

They communicate through explicit contracts.

## 43. Official References

- FBR Digital Invoicing Technical Assistance: urlOfficial FBR technical-assistance pageturn0search2
- FBR Digital Invoicing API Technical Specification: urlOfficial FBR API specificationturn0search12
- FBR Digital Invoicing FAQ: urlOfficial FBR FAQturn0search3
- FBR Licensed Integrators: urlOfficial FBR licensed-integrator listturn0search0
- FBR Digital Invoicing User Manual: urlOfficial FBR user manualturn0search27

These sources should be rechecked immediately before production deployment.
