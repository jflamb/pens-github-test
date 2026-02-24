# Ask.FDIC.gov Pathway Inventory (Observed February 24, 2026)

## Source
Authenticated exploration started at:
- `https://ask.fdic.gov/fdicinformationandsupportcenter/s/user-home`

Primary selector model in production:
- `sourceType` (who the user is)
- `complaintType` (what the user wants to do)

## Confirmed Endpoint Mappings
From direct interaction on `user-home` in an authenticated session:
- `fdiccaform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdiccustomerassistanceform/`
- `fdicdiform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdicdepositinsuranceform/`
- `fdicbaform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdicbusinessassistanceform/`
- `fdicdirform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdicdirform/`
- `fidciaform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdicinteragencyform/`
- `fdicdimcomplaintform` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/fdicdimcomplaintform/`
- `fdicLienRelease` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/requestform?type=Lien%20Release`
- `requestformAddress` -> `https://ask.fdic.gov/fdicinformationandsupportcenter/s/requestform?sub=Change%20of%20Address&type=Depositor%20Claims&subject=Change%20my%20address%20with%20the%20FDIC`

Observed but unresolved in this session:
- `fdicooform` (did not transition from `user-home` under tested state)
- `helpdeskform` (did not transition from `user-home` under tested state)

## Duplicates and IA Friction
Current production routing contains repeated intents with different labels, often pointing to the same backend form ID.

Examples:
- "Submit a Regulatory Question" and "Submit a Complaint Against a Bank" both route to `fdiccaform` in some user types.
- Multiple research/data phrasings route to `fdicdirform`.
- Failed-bank actions fan out to many `requestform` variants with parameterized query strings.

## Proposed Consolidated Workflows
For prototype IA clarity, routes are consolidated into three user-facing workflows:

1. Report a problem or concern
2. Ask a question or get guidance
3. Get help with a failed bank

Each workflow uses progressive disclosure:
- Choose workflow intent
- Choose topic
- Enter plain-language description
- Choose desired outcome
- Receive recommended destination form

## Prototype Implementation Notes
Implemented in `report-problem.html` + `support-intake.js`:
- Reusable web component: `<fdic-choice-group>`
- Shared style system for card/radio fields and validation messaging
- Required fields clearly marked
- Error summary with focusable links
- Dynamic endpoint recommendation based on selected topic
