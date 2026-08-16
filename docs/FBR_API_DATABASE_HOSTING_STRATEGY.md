# FBR Digital Invoicing Integration Specification
## Database Decision, Hosting Strategy and Implementation Direction

**Project:** FBR-POS Digital Invoicing System  
**Document:** FBR Integration Specification — Working Draft  
**Version:** 1.0  
**Date:** 16 August 2026

## 1. Purpose

This document is the technical bridge between the project requirements and actual implementation.

The first project document answered:

> What are we building and what is our overall line of action?

This document answers:

> What must our software integrate with, how should we structure the system around that integration, which database should we use, and where should the application eventually be hosted?

The most important principle is that the FBR integration must be treated as a separate, replaceable subsystem rather than allowing FBR-specific JSON fields and API behavior to spread throughout the application.

## 2. Current FBR Regulatory Position

FBR's current Digital Invoicing FAQ states that notified registered persons are required to integrate their POS, ERP or other invoicing system through a licensed integrator having a valid FBR license.

FBR also states that PRAL acts as a licensed integrator for specified purposes and provides integration services to registered persons on demand. FBR maintains a current list of licensed integrators.

Therefore:

```text
Our POS Software
       |
       | integration
       v
Licensed Integrator
       |
       | approved FBR integration
       v
FBR Digital Invoicing System
```

Our application can be developed and tested independently, but production integration must follow the current FBR rules and the applicable licensed-integrator arrangement.

The current FBR site should always be checked before production deployment because API versions, requirements, integrators, endpoints and procedures may change.

## 3. FBR Documentation Source of Truth

The project should maintain a controlled copy/reference of the current official FBR documentation.

Primary categories:

- Digital Invoicing Technical Assistance
- Digital Invoicing API Documentation
- Digital Invoicing User Manual
- Digital Invoicing FAQs
- Digital Invoicing Legal Provisions
- Current List of Licensed Integrators
- Current FBR notifications/SROs affecting integration

The application should never be designed from an unofficial blog or an old code sample when the current FBR documentation is available.

## 4. FBR Integration Architecture

The recommended architecture is:

```text
Angular POS
     |
     v
FastAPI REST API
     |
     v
Invoice Service
     |
     +----------------------+
     |                      |
     v                      v
PostgreSQL              FBR Submission Service
                              |
                              v
                         FBR Mapper
                              |
                              v
                         FBR Client
                              |
                              v
                    Licensed Integrator / FBR
                              |
                              v
                         FBR Response
                              |
                              v
                    Response Processor
                              |
                              v
                     Invoice Status
```

The frontend must never call FBR directly.

The browser should communicate only with our backend.

## 5. Why FBR Must Be Isolated

Suppose FBR changes:

```text
API version
field name
validation rule
authentication method
response structure
endpoint
```

If FBR-specific code exists throughout the POS application, the entire system becomes difficult to maintain.

Instead:

```text
Business Invoice
      |
      v
Internal Invoice Model
      |
      v
FBR Mapper
      |
      v
FBR Request Model
      |
      v
FBR API
```

Only the integration layer should need substantial changes when the external API changes.

## 6. Proposed Backend Modules

```text
backend/app/
│
├── main.py
├── config.py
├── database.py
│
├── models/
│   ├── user.py
│   ├── product.py
│   ├── contact.py
│   ├── sale.py
│   ├── payment.py
│   ├── tax.py
│   ├── fbr_submission.py
│   └── audit_log.py
│
├── schemas/
│   ├── auth.py
│   ├── product.py
│   ├── contact.py
│   ├── sale.py
│   ├── payment.py
│   └── fbr.py
│
├── routes/
│   ├── auth.py
│   ├── products.py
│   ├── contacts.py
│   ├── sales.py
│   └── reports.py
│
├── services/
│   ├── fbr_client.py
│   ├── fbr_mapper.py
│   ├── fbr_validator.py
│   ├── fbr_response.py
│   ├── fbr_submission.py
│   ├── invoice_service.py
│   └── payment_service.py
│
└── utils/
```

## 7. Internal Invoice vs FBR Invoice

This distinction is fundamental.

### Internal Invoice

Our application controls:

```text
invoice_id
invoice_number
customer
items
quantity
price
discount
tax
payment
branch
cashier
timestamps
status
```

### FBR Request

The FBR request contains the fields required by the applicable FBR API specification.

The mapping layer converts:

```text
Internal Invoice
       ↓
FBR Invoice Payload
```

The application database should not be designed as a direct copy of an FBR JSON document.

## 8. Invoice Submission Lifecycle

Recommended state machine:

```text
DRAFT
  |
  v
LOCAL_VALIDATED
  |
  v
READY_FOR_SUBMISSION
  |
  v
SUBMITTING
  |
  +------------------------+
  |                        |
  v                        v
ACCEPTED                 REJECTED
  |                        |
  v                        v
COMPLETED              ERROR/REVIEW
```

Network failures require a separate state:

```text
SUBMITTING
    |
    v
UNKNOWN / TIMEOUT
    |
    v
RECONCILIATION
    |
    +----> ACCEPTED
    |
    +----> REJECTED
    |
    +----> SAFE RETRY
```

We must not blindly resend an invoice after an HTTP timeout because the original request may have reached FBR.

## 9. Idempotency

Idempotency is one of the most important reliability requirements.

Example:

```text
Invoice #INV-000123
       |
       v
Submit to FBR
       |
       v
Network timeout
```

We do NOT immediately create:

```text
Invoice #INV-000124
```

and submit it as a replacement.

Instead we record:

```text
Original Invoice ID
Submission ID
Attempt number
Request timestamp
Response status
```

and determine whether the original submission can safely be retried/reconciled according to the applicable FBR integration behavior.

## 10. FBR Submission Table

Recommended conceptual structure:

```text
fbr_submissions
----------------
id
invoice_id
submission_reference
attempt_number
status
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

The exact fields will be finalized after the current FBR API specification has been fully mapped.

## 11. Database Decision: PostgreSQL vs MySQL

Both PostgreSQL and MySQL are excellent relational databases.

For this project, however, PostgreSQL is our recommended default.

This is not because MySQL is bad. It is because the FBR POS project is fundamentally a transactional, reporting and audit-oriented system, and PostgreSQL gives us several capabilities that are useful for long-term growth.

## 12. PostgreSQL — Merits

### 12.1 Strong relational capabilities

PostgreSQL is particularly strong for complex relational models.

Our project has relationships such as:

```text
Business
  |
  +-- Branch
       |
       +-- POS Terminal
       |
       +-- Users
       |
       +-- Sales
              |
              +-- Invoice Items
              |
              +-- Payments
              |
              +-- FBR Submission
```

PostgreSQL handles this type of model very well.

### 12.2 Excellent transactional behavior

Financial and fiscal applications require reliable transactions.

For example:

```text
Create invoice
+
Create invoice items
+
Create payment
+
Create submission record
```

should be treated as a coherent database operation where appropriate.

PostgreSQL is very strong for this.

### 12.3 Advanced SQL

PostgreSQL provides powerful SQL capabilities for:

- Reporting
- Aggregation
- Common table expressions
- Window functions
- Complex joins
- JSON operations
- Advanced indexing

These become valuable as the reporting system grows.

### 12.4 JSON support

The FBR integration will involve JSON.

PostgreSQL has excellent JSON/JSONB support.

This gives us the option to preserve selected external request/response data while still maintaining a normalized relational model.

### 12.5 Extensibility

PostgreSQL has a strong extension ecosystem and is suitable for future growth.

### 12.6 Excellent fit with modern Python applications

FastAPI + SQLAlchemy + PostgreSQL is a mature and widely used combination.

## 13. PostgreSQL — Demerits

PostgreSQL is not perfect.

### 13.1 Slightly more operational complexity

For a small developer unfamiliar with databases, PostgreSQL administration can feel more complex than basic MySQL hosting.

### 13.2 Some shared-hosting environments favor MySQL

Traditional low-cost hosting packages frequently advertise:

```text
PHP
MySQL
cPanel
```

rather than:

```text
FastAPI
Python
PostgreSQL
```

This is becoming less important if we use VPS/cloud hosting.

### 13.3 Hosting availability

Some cheap local hosting packages may offer MySQL but not a properly managed PostgreSQL environment.

For our application, a VPS is preferable anyway.

## 14. MySQL — Merits

MySQL is also a very strong choice.

### 14.1 Very widespread

MySQL is extremely common in commercial web hosting.

Finding a hosting provider that supports it is easy.

### 14.2 Familiar ecosystem

Many developers and system administrators already know:

```text
MySQL
PHP
Apache/Nginx
cPanel
```

### 14.3 Good performance

MySQL can handle high transaction volumes effectively when the schema, indexes and queries are designed correctly.

### 14.4 Good tooling

There are many administration tools, backup tools and hosting environments supporting MySQL.

### 14.5 Good choice for conventional CRUD applications

If our application were simply:

```text
Products
Customers
Orders
Users
```

MySQL would be entirely reasonable.

## 15. MySQL — Demerits

### 15.1 PostgreSQL offers a stronger advanced SQL environment

For complex reporting, data analysis and advanced relational operations, PostgreSQL is generally the more attractive choice.

### 15.2 JSON and advanced data features

MySQL supports JSON, but PostgreSQL's JSONB ecosystem and advanced SQL/data features are particularly attractive for our integration-heavy application.

### 15.3 Future analytics

If we later expand toward:

```text
Business Intelligence
Advanced reporting
Tax analytics
Data warehouse integration
AI/ML
```

PostgreSQL gives us a very strong foundation.

## 16. PostgreSQL vs MySQL Summary

| Area | PostgreSQL | MySQL |
|---|---|---|
| POS transactions | Excellent | Excellent |
| ACID transactions | Excellent | Excellent |
| Complex relationships | Excellent | Very good |
| Advanced SQL | Excellent | Very good |
| JSON/JSONB | Excellent | Very good |
| Reporting | Excellent | Very good |
| Python/FastAPI | Excellent | Excellent |
| Hosting availability | Very good | Excellent |
| Cheap shared hosting | Moderate | Excellent |
| Enterprise growth | Excellent | Excellent |
| Developer familiarity | Very good | Excellent |
| FBR JSON storage | Excellent | Very good |
| Long-term recommendation | **Preferred** | Good alternative |

## 17. Our Database Recommendation

For this project:

> **Use PostgreSQL unless a specific deployment constraint requires MySQL.**

I would not change to MySQL simply because it is more familiar or because a cheap shared-hosting package includes it.

The more important question is:

> Where are we going to host the application?

If we choose a proper VPS, PostgreSQL is not a problem.

## 18. Could We Use MySQL Anyway?

Absolutely.

The application architecture should use SQLAlchemy so that database-specific coupling is minimized.

Conceptually:

```text
FastAPI
   |
SQLAlchemy
   |
   +------ PostgreSQL
   |
   +------ MySQL
```

This means changing databases later is possible, although it is never completely free.

We should still choose one database now and develop/test consistently against it.

Recommended:

```text
Development = PostgreSQL
Testing     = PostgreSQL
Production  = PostgreSQL
```

## 19. Hosting Strategy

The project should NOT initially be hosted on ordinary shared hosting.

A FastAPI + Angular + PostgreSQL + Redis/Celery application is better suited to a VPS or cloud server.

Recommended production architecture:

```text
Internet
   |
   v
HTTPS / Reverse Proxy
   |
   v
Nginx
   |
   +------------------+
   |                  |
   v                  v
Angular             FastAPI
Static Files        Application
                       |
              +--------+--------+
              |                 |
              v                 v
         PostgreSQL          Redis
                                |
                                v
                              Celery
                                |
                                v
                          FBR Integration
```

## 20. Hosting in Pakistan

Hosting inside Pakistan is a reasonable option, especially if the application's users are primarily in Pakistan.

Potential advantages:

- Local support
- PKR billing/payment options
- Potentially lower latency for Pakistani users
- Local data-center presence
- Easier communication with the provider
- Potentially easier local business arrangements

There are Pakistani/local-market VPS providers advertising infrastructure in Karachi, Lahore and Islamabad.

However, the provider's marketing claims must not automatically be treated as a guarantee of production suitability.

## 21. Local Hosting Does Not Automatically Mean Better

We should evaluate a provider on:

```text
Uptime
Network reliability
Datacenter quality
Backup system
DDoS protection
Firewall
Root access
Virtualization technology
CPU performance
RAM
NVMe storage
Bandwidth
Dedicated IPv4
Monitoring
Support
Restore process
Off-site backups
Disaster recovery
Security
SLA
```

For an FBR-related system, uptime and recovery are more important than saving a few hundred rupees per month.

## 22. Local Pakistan VPS vs International VPS

### Pakistan VPS

Advantages:

```text
Potentially low domestic latency
Local support
PKR payment
Local infrastructure
```

Disadvantages:

```text
Smaller provider ecosystem
Potentially less mature backup/DR
Potentially smaller network capacity
Provider-specific reliability differences
```

### International VPS

Examples include providers with infrastructure in nearby regions such as:

```text
Mumbai
Dubai
Singapore
Europe
```

Advantages:

```text
Large infrastructure ecosystem
Mature automation
Strong backup options
Multiple datacenters
Scalability
```

Disadvantages:

```text
Potentially higher latency
Foreign currency billing
Potentially more complicated support
```

The correct decision should be based on measured latency and reliability rather than simply "Pakistan vs foreign."

## 23. Important Point About FBR Connectivity

Our server does not need to be physically located inside Pakistan merely because the application is integrating with FBR.

The critical requirements are:

- Stable Internet connectivity
- HTTPS
- Correct FBR configuration
- Required authentication/security configuration
- Required IP configuration/whitelisting where applicable
- Licensed-integrator requirements
- Reliable DNS
- Monitoring
- Backup/recovery

The exact networking requirements must be confirmed against the current FBR integration procedure and the selected licensed integrator.

## 24. Current FBR Integration Process Consideration

FBR's current user manual describes an API Integration process in which technical details are provided after the selected licensed integrator accepts the taxpayer's application.

The manual also notes an important distinction concerning IP whitelisting for integrators other than PRAL.

Therefore, hosting should be selected only after we know:

```text
Who is our licensed integrator?
        |
        v
What technical details do they require?
        |
        v
Do they require IP whitelisting?
        |
        v
What IP must be registered?
        |
        v
Where should our production API server live?
```

This is one reason we should not finalize the production server too early.

## 25. Recommended Initial Hosting Architecture

For development:

```text
Developer PC
   |
   +-- FastAPI
   +-- PostgreSQL
   +-- Angular
   +-- Redis
```

For staging:

```text
VPS
 |
 +-- Nginx
 +-- FastAPI
 +-- PostgreSQL
 +-- Redis
 +-- Celery
```

For production:

```text
Primary VPS
 |
 +-- Reverse Proxy
 +-- FastAPI
 +-- Angular
 +-- PostgreSQL
 +-- Redis
 +-- Celery

Separate Backup Storage
 |
 +-- Database backups
 +-- Application backups
 +-- Configuration backups
```

## 26. Single Server vs Separate Servers

### Stage 1

One reasonably sized VPS is acceptable:

```text
Nginx
FastAPI
PostgreSQL
Redis
Celery
Angular
```

This keeps cost and administration low.

### Stage 2

As traffic increases:

```text
Server 1
Web/API

Server 2
Database

Server 3
Workers/Redis

Backup Server/Object Storage
Backups
```

We should not over-engineer the first version.

## 27. Suggested Initial Production VPS

For an initial deployment with a modest number of businesses/users, a reasonable starting point would be approximately:

```text
2–4 vCPU
8 GB RAM
100+ GB NVMe
Dedicated IPv4
Linux
Automated backups
Firewall
Monitoring
```

The exact capacity should be determined from actual transaction volume rather than guessed.

A small pilot may run on less.

A large multi-business deployment will require more.

## 28. Hosting Provider Evaluation

When we are ready to choose the provider, I recommend comparing at least:

### Local Pakistan options

Investigate providers offering:

- Karachi infrastructure
- Lahore infrastructure
- Islamabad infrastructure
- Managed VPS
- Root-access VPS

Examples currently visible in the Pakistan market include providers such as WebSouls, HostBreak, CreativeON and other local VPS/cloud providers.

These should be evaluated on actual SLA, infrastructure, support and backup terms rather than brand name alone.

### International options

We can also compare:

- Hostinger VPS
- Hetzner
- DigitalOcean
- Vultr
- AWS
- Azure
- Google Cloud

For the first production version, hyperscalers such as AWS/Azure/GCP may be unnecessarily expensive/complex unless we need their specific services.

## 29. My Current Hosting Recommendation

For our project I would start with:

```text
Development
    ↓
Local PostgreSQL

Staging
    ↓
Pakistan VPS or nearby-region VPS

Production
    ↓
Reliable VPS
    +
Off-site encrypted backups
```

If the target market is primarily Pakistani businesses, a good Pakistan-based VPS is worth testing.

But I would make the final decision only after:

1. Testing FBR connectivity.
2. Identifying the licensed integrator.
3. Confirming IP/network requirements.
4. Testing latency.
5. Verifying backup/restore.
6. Reviewing SLA.
7. Reviewing security.
8. Confirming monthly and renewal costs.

## 30. Backup Strategy

Backups are mandatory.

At minimum:

```text
Daily database backup
+
Frequent incremental backup where practical
+
Off-server backup
+
Periodic restore test
```

Do NOT rely on:

```text
"the VPS provider says backups are included"
```

without testing restoration.

A backup that cannot be restored is not a reliable backup.

## 31. Disaster Recovery

We should define:

### RPO

How much data can we afford to lose?

For a financial application, the target should be very small.

### RTO

How quickly must the service be restored?

For example:

```text
Target:
RPO <= 15 minutes
RTO <= 1–4 hours
```

These are proposed engineering targets, not FBR requirements.

The final values depend on business requirements.

## 32. Security Architecture

Production should use:

```text
HTTPS
+
Firewall
+
SSH key authentication
+
Disabled root/password login where appropriate
+
Non-default SSH configuration
+
Automatic security updates
+
Application secrets outside Git
+
Database not publicly exposed
+
Encrypted backups
+
Monitoring
```

PostgreSQL should normally listen only on the internal/private interface when application and database services are on the same private network.

## 33. Domain and HTTPS

We should eventually use something like:

```text
pos.example.pk
api.example.pk
```

with:

```text
HTTPS
```

The Angular frontend should communicate with:

```text
https://api.example.pk
```

rather than directly exposing database services.

## 34. Development Environment

Our current development environment can remain:

```text
K:\fbr-pos\
│
├── venv\
├── backend\
├── frontend\
├── docs\
└── tests\
```

The Python virtual environment should remain at:

```text
K:\fbr-pos\venv
```

not:

```text
K:\fbr-pos\backend\venv
```

## 35. Requirements File

Our backend dependency management should remain in:

```text
backend/requirements.txt
```

Initial dependencies can include:

```text
fastapi
uvicorn[standard]
sqlalchemy
psycopg
python-dotenv
httpx
celery
redis
```

Authentication dependencies will be finalized when we implement the security layer.

If we select MySQL instead, the database driver would change accordingly.

## 36. Recommended Database Choice

### Decision

**PostgreSQL**

### Reason

The project is expected to contain:

```text
Financial transactions
Tax calculations
Complex relational data
FBR request/response records
Audit trails
Reporting
Potential multi-branch support
Potential multi-business support
Future analytics
```

PostgreSQL provides an excellent foundation for this.

MySQL remains an acceptable alternative if a specific deployment or organizational requirement makes it preferable.

## 37. Recommended Hosting Choice

### Development

```text
Local PC
```

### Early staging

```text
Low-cost VPS
```

### Initial production

```text
Reliable VPS
+
Automated backups
+
Off-site backup
+
Monitoring
+
HTTPS
```

### Scaling later

```text
Load Balancer
       |
       +---- API Server 1
       |
       +---- API Server 2
       |
       +---- Worker Server
       |
       +---- PostgreSQL
       |
       +---- Redis
       |
       +---- Backup Storage
```

## 38. Immediate Next Step

Now that the high-level requirements and database/hosting direction are defined, our next technical task is to create the actual FBR integration specification from the current official API documentation.

We will build:

```text
docs/FBR_API_FIELD_MAPPING.md
```

It should contain a table like:

| Internal Field | FBR Field | Type | Required? | Validation | Transformation |
|---|---|---|---|---|---|
| invoice_number | TBD | string | TBD | TBD | TBD |
| invoice_date | TBD | date | TBD | TBD | TBD |
| buyer_name | TBD | string | TBD | TBD | TBD |
| item_code | TBD | string | TBD | TBD | TBD |
| quantity | TBD | decimal | TBD | TBD | TBD |
| rate | TBD | decimal | TBD | TBD | TBD |
| tax | TBD | decimal | TBD | TBD | TBD |

We will populate this table only from the current official FBR API documentation.

## 39. Final Architecture Decision

At this stage our working architecture is:

```text
                 FBR POS SYSTEM
                       |
          ┌────────────┴────────────┐
          |                         |
       Angular                   FastAPI
       Frontend                   Backend
                                    |
                 ┌──────────────────┼─────────────────┐
                 |                  |                 |
             PostgreSQL         Redis/Celery       FBR Service
                                                     |
                                                     v
                                            Licensed Integrator
                                                     |
                                                     v
                                                FBR System
```

### Current decisions

```text
Backend       = FastAPI
Frontend      = Angular
ORM           = SQLAlchemy
Database      = PostgreSQL
Queue         = Celery
Broker        = Redis
HTTP Client   = HTTPX
Deployment    = Linux VPS
Architecture  = Modular monolith initially
FBR Layer     = Isolated integration service
```

### Decisions deliberately postponed

```text
Production VPS provider
Production server location
Licensed integrator
Exact production FBR endpoint
Exact production networking/IP configuration
High-availability architecture
```

These should be decided after the current FBR integration process is fully documented and tested.

## 40. Guiding Principle

The goal is not to make a quick POS application.

The goal is to build a system that can survive:

```text
Real invoices
Real customers
Real tax calculations
Real FBR responses
Network failures
API changes
Audits
Multiple branches
Growing transaction volume
Production outages
```

Therefore:

> **Correctness first. Reliability second. Security third. Convenience fourth.**

That principle should guide every subsequent architectural decision.
