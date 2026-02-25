# TODO

## Current Task
- [x] Define Phase 1 implementation scope from gap-closure plan.
- [x] Add Phase 1 baseline fields to intake UI (identity, contact verification, mailing block, desired resolution).
- [x] Update intake state, validation, and progressive gating for new required fields.
- [x] Update review and confirmation pages/scripts to display new fields.
- [x] Keep case-history storage non-sensitive while preserving submission summary.
- [x] Run JS syntax checks and verify no broken references.

## Review / Results
- Replaced prior state/contact-method sections with Phase 1 baseline fields:
  - First/last name
  - Email + confirm email
  - Mailing street/city/state/postal/country
  - Desired resolution free-text
  - Business phone (required for failed-bank intent)
- Updated validation/progress gating to 7 required sections.
- Updated review and confirmation summaries to include new baseline fields.
- Preserved non-sensitive case-history storage in `localStorage` summary records.
- Verification:
  - `node --check` passed for all support/FAQ scripts.
  - Reference grep confirmed old removed field IDs are no longer referenced.
