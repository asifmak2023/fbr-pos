# FBR Digital Invoicing POS System
## Requirements, Architecture and Line of Action

**Project:** FBR-POS Digital Invoicing System  
**Document Type:** Project Requirements & Implementation Roadmap  
**Version:** 1.0  
**Date:** 16 August 2026

## 1. Executive Summary

The objective of this project is to build a production-oriented Point of Sale (POS) and digital invoicing application for Pakistani businesses that can create sales invoices, maintain products and customers, calculate applicable taxes, communicate with the Federal Board of Revenue (FBR) Digital Invoicing system, receive the FBR response/invoice number, and provide an auditable record of every transaction.

This is not simply a billing application. The central requirement is to build a reliable integration layer between a business's POS/invoicing system and FBR's Digital Invoicing API.

FBR's current public documentation states that notified registered persons must integrate their POS, ERP or invoicing system through a licensed integrator. FBR also states that PRAL acts as a licensed integrator for specified purposes and provides integration services to registered persons on demand. Therefore, our software architecture must distinguish between:

1. The business/POS application we develop.
2. The FBR Digital Invoicing API integration.
3. The legal/licensing role of an FBR licensed integrator.
4. The taxpayer's registration/configuration with FBR.

The software can be developed and tested independently, but production integration for a taxpayer must follow the current FBR rules and licensed-integrator requirements.

## 2. Important Regulatory Boundary

This project must not assume that building software automatically makes us an FBR licensed integrator.

FBR's FAQ currently says that notified registered persons must integrate their POS, ERP or invoicing system through a licensed integrator having a valid FBR integration license. It also states that only a licensed integrator can configure a registered person's software for real-time electronic transmission to FBR.

Accordingly, our development plan will support two possible operating models:

### Model A — Integration through an existing licensed integrator

Our software acts as the taxpayer's POS/ERP/invoicing system and communicates through the licensed integration arrangement.

This is the preferred initial model.

### Model B — Become/operate as a licensed integrator

If the business objective later becomes providing FBR integration services to multiple external taxpayers, we must separately investigate and satisfy FBR's licensing, security, testing, registration and operational requirements.

We should not treat Model B as automatically included in the application-development project.

## 3. What We Are Building

The proposed system will contain the following major layers:

```text
                    ┌──────────────────────────────┐
                    │          FRONTEND            │
                    │      Angular POS UI          │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       FASTAPI BACKEND        │
                    │                              │
                    │ Auth / Products / Sales      │
                    │ Customers / Reports / Admin   │
                    └──────────────┬───────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │ PostgreSQL   │   │ FBR Service  │   │ Redis/Celery │
        │ Database     │   │ Integration  │   │ Background   │
        └──────────────┘   └──────┬───────┘   │ Jobs        │
                                  │            └──────────────┘
                                  ▼
                       ┌──────────────────────┐
                       │ FBR Digital          │
                       │ Invoicing API        │
                       └──────────────────────┘
```

## 4. Primary Functional Requirements

### 4.1 Business/Tenant Management

The system should support:

- Business/company profile
- NTN/CNIC information where applicable
- STRN where applicable
- Business name
- Business address
- Province
- City
- Branches
- POS terminals
- POS identification numbers
- FBR configuration
- FBR environment selection
- FBR credentials/tokens
- Invoice numbering configuration
- Tax configuration

The system should be designed for future multi-branch and potentially multi-tenant operation even if version 1 starts with a single business.

### 4.2 User and Authentication Management

The application should support:

- User registration
- Login
- Logout
- Password hashing
- Role-based access control
- Administrator
- Manager
- Cashier
- Accountant
- Auditor/read-only user
- Session/token management
- Password reset
- Account status
- Audit logging

Passwords must never be stored as plain text.

### 4.3 Product Management

The product module should support:

- Product code/SKU
- Barcode
- Product name
- Description
- Category
- Unit of measure
- Purchase price
- Sale price
- Tax rate
- Tax category
- Inventory quantity
- Minimum stock level
- Active/inactive status

Future extensions may include:

- Batch numbers
- Expiry dates
- Serial numbers
- Multiple warehouses
- Product variants
- Discounts
- Promotions

### 4.4 Customer/Contact Management

The system should maintain:

- Customer name
- NTN/CNIC where applicable
- Registration status
- Province
- City
- Address
- Phone
- Email
- Customer type
- Buyer registration type
- Tax-related information required by the FBR invoice model

The system must not assume that every buyer has the same identification requirements. Validation rules must be configurable according to the applicable FBR invoice scenario.

### 4.5 Sales/Invoicing

The POS must allow the operator to:

1. Select products.
2. Enter quantities.
3. Apply permitted discounts.
4. Calculate line totals.
5. Calculate applicable taxes.
6. Calculate invoice totals.
7. Capture buyer information where required.
8. Validate the invoice.
9. Save the local invoice.
10. Submit the required invoice data to FBR.
11. Receive and store the FBR response.
12. Display the resulting FBR invoice/reference number where applicable.
13. Print or generate the customer receipt/invoice.
14. Preserve an audit trail.

The application must treat the FBR response as an important part of the invoice lifecycle rather than merely logging the HTTP response.

## 5. FBR Integration Requirements

FBR's current Digital Invoicing API documentation describes API methods for Digital Invoicing, including POST and VALIDATE operations. The current technical documentation identifies the `postinvoicedata` method and provides a sandbox endpoint and JSON invoice structure.

The integration layer therefore needs:

- FBR API client
- Request model
- Response model
- Authentication/security-token handling
- Sandbox configuration
- Production configuration
- Request validation
- Response validation
- Timeout handling
- Retry policy
- Error classification
- Logging
- Audit trail
- Idempotency protection
- FBR response persistence
- API version management

The current FBR documentation must be treated as the authoritative source for the exact production endpoint, fields, scenarios, validation rules and credentials at the time of deployment.

## 6. FBR Invoice Data Mapping

The POS's internal invoice model must be separated from the FBR API model.

This is very important.

We should NOT make our entire database dependent on the exact JSON structure of the FBR API.

Instead:

```text
Internal Invoice
      │
      ▼
FBR Invoice Mapper
      │
      ▼
FBR API Request DTO
      │
      ▼
FBR API
      │
      ▼
FBR API Response DTO
      │
      ▼
FBR Response Processor
      │
      ▼
Internal Invoice Status
```

This design allows FBR API versions to change without requiring a complete rewrite of the POS system.

## 7. Invoice Lifecycle

The proposed invoice lifecycle is:

```text
DRAFT
  │
  ▼
VALIDATED LOCALLY
  │
  ▼
READY FOR FBR
  │
  ▼
SUBMITTED
  │
  ├──────────────► FBR ACCEPTED
  │                    │
  │                    ▼
  │              FBR INVOICE NUMBER
  │                    │
  │                    ▼
  │                COMPLETED
  │
  └──────────────► FBR REJECTED
                       │
                       ▼
                    ERROR
```

Additional states should be considered for:

- Pending
- Retry required
- Network failure
- Validation failure
- Cancelled
- Credit note
- Debit note

The exact legal and API behavior of cancellation, debit notes and credit notes must be implemented according to the applicable FBR rules and API documentation.

## 8. Reliability Requirement

A major architectural requirement is that an internet or FBR API failure must not corrupt the local accounting record.

For example:

```text
Customer buys goods
       │
       ▼
POS creates invoice
       │
       ▼
Local database transaction
       │
       ▼
FBR submission
       │
       ├── Success ──► Completed
       │
       └── Failure ──► Pending/Retry
```

We should not blindly create a second invoice every time an API call times out.

The system needs an idempotency strategy so that a network timeout does not result in duplicate fiscal submissions.

## 9. Database Requirements

The initial PostgreSQL database should contain entities approximately along these lines:

```text
users
roles
permissions

businesses
branches
pos_terminals

products
product_categories
units

customers
customer_addresses

invoices
invoice_items

payments
taxes
tax_rates

fbr_configurations
fbr_submissions
fbr_responses

audit_logs
system_settings
```

The final schema will be produced after the FBR data model and business requirements have been analyzed in detail.

## 10. FBR Submission Record

Every FBR submission should have a dedicated database record.

Conceptually:

```text
FBR Submission
--------------
id
invoice_id
request_payload
response_payload
submission_status
http_status
fbr_invoice_number
fbr_reference_number
error_code
error_message
attempt_count
submitted_at
responded_at
created_at
updated_at
```

Sensitive credentials must NOT be stored inside ordinary invoice records.

## 11. Security Requirements

Security is a first-class requirement.

The application should implement:

- HTTPS in production
- Secure password hashing
- JWT/session security
- Role-based authorization
- Environment-based secrets
- No hard-coded FBR tokens
- No secrets committed to Git
- Input validation
- SQL injection protection through ORM/parameterized queries
- Rate limiting where appropriate
- Audit logging
- Secure error handling
- Restricted administrative endpoints
- Database backups
- Secret rotation capability

The `.env` file is for local development only and should not be committed to source control.

A `.env.example` file should be maintained instead.

## 12. Technology Stack

### Backend

Recommended:

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- HTTPX
- Redis
- Celery
- python-dotenv or a stronger settings mechanism
- JWT-based authentication
- Password hashing library

### Frontend

The current project structure proposes:

- Angular
- TypeScript
- Angular Router
- Angular services for API communication

### Development

- Git
- GitHub/GitLab
- VS Code
- Python virtual environment
- pytest
- Ruff
- mypy where appropriate
- Docker
- Docker Compose

## 13. Why PostgreSQL

PostgreSQL is recommended because this system is transactional and accounting-oriented.

We need strong:

- ACID transactions
- Referential integrity
- Constraints
- Indexing
- Transaction history
- Reporting capability
- Data consistency

Invoice creation, invoice items, payments and fiscal submission records should be designed around transactional consistency.

## 14. Why Redis/Celery

FBR communication is an external dependency.

Not every operation needs to block the user's POS interface.

Celery/Redis can eventually handle:

- Retry jobs
- Failed FBR submissions
- Report generation
- Notifications
- Background synchronization
- Scheduled maintenance

However, real-time invoice submission requirements must be respected. We should not introduce unnecessary asynchronous behavior where the business process requires an immediate FBR response.

## 15. Frontend Requirements

The Angular application should contain:

```text
Login
Dashboard
Products
Customers
Sales/POS
Invoices
Reports
Users
Branches
POS Terminals
FBR Configuration
System Settings
Audit Logs
```

The POS screen should be optimized for fast operation.

A cashier should be able to:

```text
Search/scan product
      ↓
Enter quantity
      ↓
Review cart
      ↓
Select payment method
      ↓
Capture buyer information if required
      ↓
Create invoice
      ↓
Submit to FBR
      ↓
Receive result
      ↓
Print/display invoice
```

## 16. Reporting Requirements

Initial reports should include:

- Daily sales
- Sales by date range
- Sales by cashier
- Sales by branch
- Product sales
- Tax summary
- Invoice status
- FBR submission status
- FBR failures
- Pending invoices
- Cancelled invoices
- Payment summary

Future reporting can include accounting and inventory analytics.

## 17. Audit Requirements

Important actions should be logged:

- Login
- Logout
- User creation
- User changes
- Product creation/update
- Price changes
- Invoice creation
- Invoice modification
- Invoice submission
- FBR response
- Invoice cancellation
- Configuration changes
- Failed authentication
- Administrative actions

Audit records should be append-oriented and protected from ordinary users.

## 18. Testing Strategy

We should NOT wait until the end to test FBR integration.

Testing will happen in layers.

### Level 1 — Unit Tests

Test:

- Tax calculations
- Invoice calculations
- Validation
- Product calculations
- FBR mapping
- Response parsing
- Error handling

### Level 2 — API Tests

Test FastAPI endpoints.

### Level 3 — Database Tests

Test:

- Invoice creation
- Invoice items
- Relationships
- Transactions
- Constraints

### Level 4 — Integration Tests

Test:

```text
POS
 ↓
Backend
 ↓
Database
 ↓
FBR Service
 ↓
FBR Sandbox
```

### Level 5 — End-to-End Tests

Test a complete user journey:

```text
Login
→ Product selection
→ Customer selection
→ Invoice
→ Tax calculation
→ FBR submission
→ FBR response
→ Receipt
→ Reporting
```

## 19. Sandbox First

We will NOT start by targeting production FBR services.

Development should begin with:

```text
Local Development
        ↓
Automated Tests
        ↓
FBR Sandbox
        ↓
Integration Verification
        ↓
Production Configuration
```

The current FBR technical documentation provides sandbox-specific examples and endpoints. Sandbox credentials and exact current routing must be obtained through the applicable FBR integration/registration process.

## 20. Configuration Strategy

The application should distinguish:

```text
Development
Testing
Sandbox
Production
```

Configuration should not be scattered throughout the code.

For example:

```text
backend/
└── app/
    └── config.py
```

and environment variables:

```text
APP_ENV=
DATABASE_URL=
SECRET_KEY=

FBR_ENVIRONMENT=
FBR_API_BASE_URL=
FBR_SECURITY_TOKEN=
FBR_TIMEOUT=
```

Actual FBR credentials must never be placed directly into source code.

## 21. Project Structure

Our proposed structure is:

```text
fbr-pos/
│
├── venv/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/
│   │   │   └── shared/
│   │   ├── assets/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
├── tests/
│
├── docs/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 22. Recommended Development Phases

### Phase 0 — Regulatory and Technical Discovery

Before serious coding:

- Collect the latest FBR Digital Invoicing technical documentation.
- Identify the currently applicable API version.
- Identify current sandbox and production endpoints.
- Identify authentication/security-token requirements.
- Study invoice request fields.
- Study response structures.
- Study scenarios.
- Study validation rules.
- Study error codes.
- Study cancellation/credit/debit-note behavior.
- Understand taxpayer registration.
- Understand licensed-integrator requirements.
- Identify the intended licensed-integrator arrangement.

Deliverable:

```text
docs/FBR_INTEGRATION_SPECIFICATION.md
```

### Phase 1 — Project Foundation

Set up:

- Git repository
- Python virtual environment
- FastAPI
- PostgreSQL
- SQLAlchemy
- Configuration
- Logging
- Environment variables
- Basic project structure

Deliverable:

A running backend with:

```text
GET /health
```

### Phase 2 — Database Architecture

Design and implement:

- Users
- Roles
- Businesses
- Branches
- POS terminals
- Products
- Customers
- Invoices
- Invoice items
- Payments
- Tax configuration
- FBR submissions
- Audit logs

Deliverable:

Stable database schema and migrations.

### Phase 3 — Authentication

Implement:

- Login
- Password hashing
- JWT/session mechanism
- Roles
- Permissions
- Protected routes

Deliverable:

Secure authentication system.

### Phase 4 — Product and Customer Modules

Implement:

- Product CRUD
- Categories
- Pricing
- Tax information
- Customer CRUD
- Search
- Validation

Deliverable:

Operational master-data management.

### Phase 5 — POS/Invoice Engine

Implement:

- Cart
- Product scanning/search
- Quantity
- Discounts
- Tax calculations
- Invoice totals
- Payment
- Invoice persistence
- Invoice states

Deliverable:

A complete local POS invoice without FBR dependency.

### Phase 6 — FBR Integration Adapter

Implement:

```text
FBRClient
FBRRequestBuilder
FBRResponseParser
FBRErrorHandler
FBRSubmissionService
```

Deliverable:

A clean, isolated FBR integration layer.

### Phase 7 — FBR Sandbox

Connect the integration adapter to the current FBR sandbox.

Test:

- Valid invoice
- Invalid invoice
- Missing data
- Invalid buyer information
- Tax errors
- Authentication failure
- Network failure
- Timeout
- Duplicate submission
- Retry
- FBR rejection
- FBR acceptance

Deliverable:

Verified sandbox integration.

### Phase 8 — Frontend

Build Angular modules:

```text
auth
dashboard
products
contacts
sales
reports
settings
```

Deliverable:

Complete POS web application.

### Phase 9 — Reliability and Security

Implement:

- Retry
- Idempotency
- Audit logs
- Structured logging
- Error monitoring
- Database backup
- Secret management
- Access control
- Security testing

Deliverable:

Production-ready architecture.

### Phase 10 — Production Integration

Only after the regulatory and licensing requirements are satisfied:

- Obtain production credentials/configuration.
- Configure the licensed integration arrangement.
- Complete FBR-required testing.
- Configure production environment.
- Perform controlled production testing.
- Monitor FBR submissions.
- Establish support and recovery procedures.

## 23. FBR Integration Service Design

The FBR service should be isolated from the rest of the application.

Recommended structure:

```text
services/
│
├── fbr_client.py
├── fbr_mapper.py
├── fbr_validator.py
├── fbr_response.py
├── fbr_submission.py
└── fbr_errors.py
```

The rest of the application should call something conceptually like:

```text
InvoiceService
       │
       ▼
FBRSubmissionService
       │
       ▼
FBRMapper
       │
       ▼
FBRClient
       │
       ▼
FBR API
```

This prevents FBR-specific implementation details from leaking into every module.

## 24. Error Handling Strategy

Errors must be classified.

### Business errors

Example:

```text
Invalid tax information
Invalid buyer information
Missing mandatory field
```

### FBR validation errors

Example:

```text
FBR rejected request
```

### Authentication errors

Example:

```text
Invalid/expired security token
```

### Network errors

Example:

```text
Timeout
Connection refused
DNS failure
```

### System errors

Example:

```text
Database unavailable
Unexpected application exception
```

Each category should have an appropriate recovery strategy.

## 25. Logging Strategy

Every FBR submission should have a traceable identifier.

Conceptually:

```text
Application Invoice ID
        ↓
Submission ID
        ↓
HTTP Request
        ↓
FBR Response
```

This allows an administrator to answer:

- What invoice was submitted?
- When?
- By whom?
- With what status?
- What did FBR return?
- Was it retried?
- What was the final result?

Sensitive credentials and secrets must never appear in logs.

## 26. Data Integrity Rules

An invoice should not be silently changed after fiscal submission.

Once FBR has accepted an invoice:

```text
Accepted invoice
      ↓
Immutable fiscal record
```

If the business needs a correction, the application should implement the legally/API-supported mechanism rather than simply editing the original fiscal invoice.

This is particularly important for cancellation, credit notes and debit notes.

## 27. Deployment Strategy

Initial development:

```text
Windows
↓
Python venv
↓
PostgreSQL
↓
FastAPI
↓
Angular
```

Production can later use:

```text
Docker
   │
   ├── FastAPI
   ├── PostgreSQL
   ├── Redis
   ├── Celery
   └── Reverse Proxy
```

The exact production infrastructure will depend on the deployment environment and security requirements.

## 28. Documentation We Will Maintain

The project should maintain:

```text
docs/
├── PROJECT_REQUIREMENTS.md
├── FBR_INTEGRATION_SPECIFICATION.md
├── ARCHITECTURE.md
├── DATABASE_DESIGN.md
├── API_DESIGN.md
├── SECURITY.md
├── DEPLOYMENT.md
├── TESTING.md
└── TROUBLESHOOTING.md
```

This prevents the project architecture from becoming dependent on undocumented decisions.

## 29. What We Should NOT Do

We should avoid:

- Hard-coding FBR URLs throughout the application.
- Hard-coding security tokens.
- Treating FBR as just another CRUD endpoint.
- Coupling the database directly to one FBR JSON version.
- Storing FBR credentials in Git.
- Automatically retrying without idempotency protection.
- Marking an invoice successful before a valid FBR response is processed.
- Assuming an HTTP 200 response automatically means fiscal acceptance.
- Building only the UI first and postponing the fiscal data model.
- Testing production before sandbox verification.
- Assuming that software development alone grants FBR integration authority.
- Implementing legal/tax rules from memory instead of the current FBR documentation.

## 30. Definition of Done

The project will be considered technically ready when:

- User authentication works.
- Roles and permissions work.
- Products work.
- Customers work.
- POS sales work.
- Taxes are calculated correctly.
- Invoices are stored transactionally.
- FBR payloads are generated correctly.
- FBR responses are processed correctly.
- FBR errors are handled.
- Retry behavior is safe.
- Duplicate submissions are prevented.
- Audit logs work.
- Sandbox testing passes.
- Reports work.
- Security checks pass.
- Production configuration is separated from development.
- FBR/licensed-integrator requirements have been satisfied.
- Deployment documentation exists.
- Backup/recovery procedures exist.

## 31. Immediate Next Actions

We should NOT start writing all the application code at once.

Our immediate sequence should be:

```text
STEP 1
Study current FBR legal requirements
        ↓
STEP 2
Study current FBR Digital Invoicing API specification
        ↓
STEP 3
Extract the exact invoice data model
        ↓
STEP 4
Extract scenarios and validation rules
        ↓
STEP 5
Design our internal invoice model
        ↓
STEP 6
Design FBR mapping layer
        ↓
STEP 7
Finalize database schema
        ↓
STEP 8
Finalize backend architecture
        ↓
STEP 9
Build FastAPI foundation
        ↓
STEP 10
Build database/models
        ↓
STEP 11
Build authentication
        ↓
STEP 12
Build Product/Customer modules
        ↓
STEP 13
Build POS invoice engine
        ↓
STEP 14
Build FBR adapter
        ↓
STEP 15
Connect to FBR sandbox
        ↓
STEP 16
Build Angular frontend
        ↓
STEP 17
Testing + security + reliability
        ↓
STEP 18
Production/licensed-integrator process
        ↓
STEP 19
Production deployment
```

## 32. First Development Milestone

Our first real milestone should NOT be "build the POS screen."

It should be:

> **Understand and freeze the FBR integration contract before implementing the application around it.**

The first technical artifact should therefore be:

```text
docs/FBR_INTEGRATION_SPECIFICATION.md
```

It will contain:

- Current FBR API version
- Sandbox endpoint
- Production endpoint
- Authentication
- Security token
- Request headers
- Invoice header fields
- Invoice item fields
- Data types
- Mandatory fields
- Conditional fields
- Scenario IDs
- Tax fields
- Buyer fields
- Seller fields
- Response fields
- Error codes
- Validation rules
- Retry requirements
- Cancellation behavior
- Credit-note behavior
- Debit-note behavior
- Registration/configuration requirements
- Licensed-integrator considerations

Only after this document is verified against the current official FBR documentation should we freeze our database and application architecture.

## 33. Current Official References

The official FBR Digital Invoicing technical-assistance page provides access to the Digital Invoicing API documentation and related technical material.

The current FBR technical documentation includes a Digital Invoicing API specification describing POST and VALIDATE methods and a sandbox example for `postinvoicedata`.

FBR's current FAQ states that notified registered persons must integrate POS/ERP/invoicing systems through a licensed integrator and that PRAL provides integration services under the stated rules.

Official sources:

- FBR Digital Invoicing Technical Assistance
- FBR Digital Invoicing API Technical Documentation
- FBR Digital Invoicing FAQs
- FBR List of Licensed Integrators

These sources must be rechecked before production deployment because FBR specifications, API versions, requirements and licensed-integrator arrangements can change.

## 34. Final Project Vision

The final system should not merely be:

```text
POS → FBR API
```

It should be:

```text
                    FBR POS PLATFORM
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       FRONTEND         BACKEND          DATABASE
       Angular          FastAPI          PostgreSQL
          │                │                │
          │          Business Services     │
          │                │                │
          │        ┌───────┴───────┐        │
          │        │               │        │
          │    Invoice Engine   FBR Engine  │
          │                        │        │
          │                        ▼        │
          │                  FBR Digital    │
          │                  Invoicing API  │
          │                        │        │
          │                        ▼        │
          │                 FBR Response    │
          │                        │        │
          └────────────────────────┴────────┘
```

The guiding principle will be:

> **Build the POS as a proper business application, and build FBR integration as a carefully isolated fiscal integration subsystem.**

That architecture gives us room to support multiple branches, multiple POS terminals, inventory, reporting, accounting integrations, and future FBR API changes without rebuilding the entire application.
