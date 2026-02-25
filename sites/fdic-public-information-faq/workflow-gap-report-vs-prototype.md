# Gap Report: Existing Endpoint Forms vs Current Prototype Intake

Date: 2026-02-25
Source field inventory: [workflow-endpoint-field-matrix.md](./workflow-endpoint-field-matrix.md)

## Current prototype required fields
From `report-problem.html` + `support-intake.js`:
- Intent (`report` / `ask` / `failed`)
- Concern topic
- Issue details (narrative)
- Desired outcome
- State of residence
- Follow-up contact method + value (email or phone)

## Executive summary
The prototype captures routing intent and a minimal narrative/contact set, but it does **not yet capture several consistently required fields** in terminal production forms.

Most significant gaps:
- Identity fields: first name, last name
- Contact verification: confirm email
- Mailing/contact address: street + city (+ country in many forms)
- Requestform family baseline: business phone + mailing address package
- Specialized endpoint fields (especially appraisal workflow): user-role classification, subject-of-complaint details, property address, complaint-type checklists, authorization checkbox

## Coverage by endpoint family
| Endpoint family | Prototype coverage | Key missing required fields | Severity |
|---|---|---|---|
| `fdiccaform` (Customer Assistance) | Partial | First name, last name, mailing street, mailing city, mailing zip, mailing country, desired resolution free-text | High |
| `fdicbaform` (Business Assistance) | Partial | First name, last name, confirm email, mailing street/city/country, desired resolution free-text | High |
| `fdicdiform` (Deposit Insurance) | Partial | First name, last name, confirm email, mailing street/city/country | High |
| `fdicdirform` (Directory/Data Inquiry) | Partial | First name, last name, specific description field semantics, optional prior-contact metadata | Medium |
| `fidciaform` (Interagency Appraisal) | Low | First/last name, confirm email, mailing street/city/country, who-are-you classification, property address, complaint-category selections | Critical |
| `fdicdimcomplaintform` (Insured Status) | Partial | Desired resolution free-text and possible category qualifiers | Medium |
| `fdicooform` (Comment/Complaint Against FDIC) | Partial | Desired resolution free-text; state usage is inconsistent with current prototype model | Medium |
| `requestform` family (`type` and `sub` variants) | Low | First/last name, confirm email, business phone, mailing street address, mailing city | Critical |
| `powerofattorneyform` | Low | First/last name, confirm email, business phone, mailing street/city | Critical |
| `recordsdestructionform` | Low | First/last name, confirm email, business phone, mailing street/city | Critical |

## Detailed gap themes

### 1) Identity/contact package is incomplete
Observed repeatedly as required in most endpoint forms:
- First name
- Last name
- Email + confirm email
- Business phone (especially requestform family)

Prototype currently has only a follow-up contact method/value.

### 2) Mailing address package is under-collected
Observed required in many forms:
- Mailing street
- Mailing city
- Mailing country code
- Sometimes mailing zip/postal code

Prototype currently has state only.

### 3) Resolution semantics mismatch
Several forms require both:
- Complaint/inquiry narrative
- Desired resolution (often free-text)

Prototype has narrative plus a high-level outcome choice, but no explicit free-text desired resolution field.

### 4) Specialized-domain questions missing
Most prominent in appraisal and failed-bank workflows:
- Who are you? (role taxonomy)
- Who/what complaint is about
- Property-specific details
- Asset/record/document context metadata
- Authorization acknowledgment checkbox

Prototype uses simplified topic selection and does not yet model these endpoint-specific data blocks.

### 5) Conditional branches likely underrepresented
Several forms show many disabled controls that activate based on prior answers.
The prototype currently has shallow progressive branching and likely misses downstream conditional required fields.

## Risk of staying as-is
- Incomplete submissions for downstream operations
- Higher back-and-forth follow-up burden
- Reduced triage quality and longer resolution times
- Potential inability to replace legacy forms for complex pathways (especially failed-bank + appraisal)
