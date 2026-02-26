# TODO

## Current Task (DIR Discoverability Copy)
- [x] Make DIR discoverable in the top-level "Ask a question or get guidance" intent description.
- [x] Rename the ask-flow data topic to explicitly reference FDIC Bank Data and Research (DIR).
- [x] Keep phrasing concise while adding key examples (QBP, Call Reports, industry analysis).

## Review / Results (DIR Discoverability Copy)
- Updated intent option detail copy so users see DIR terms at first decision point.
- Updated ask-flow topic copy to a clearly named DIR option with concise examples.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`

## Current Task (Progressive Guidance Copy)
- [x] Replace section-count helper copy with progressive-disclosure helper guidance.
- [x] Show `Make a selection to continue.` when the current required step is radio-based.
- [x] Remove redundant static submit-note copy near the CTA.

## Review / Results (Progressive Guidance Copy)
- Updated helper messaging logic in intake step-state handling to be current-step aware.
- Radio steps now use: `Make a selection to continue.`
- Text entry steps now use concise guidance (`Enter details to continue.` / `Complete this section to continue.`).
- Removed static line: `You can review and edit your answers before final submission.`
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`

## Current Task (Form Rhythm Tuning)
- [x] Audit intake-page vertical spacing tokens after intro content.
- [x] Adjust intake CSS spacing to keep consistent rhythm from intro through form sections.
- [x] Verify updated spacing in desktop and mobile breakpoints.

## Review / Results (Form Rhythm Tuning)
- Aligned intake-page rhythm with the intro section by increasing:
  - top spacing into the intake layout (`.report-layout` `padding-top`)
  - heading-to-body separation in the intake panel (`.report-main h2`)
  - spacing before first form block (`.report-required-note`)
  - subcopy breathing room and readability (`.report-subcopy` margin + line-height)
- Verification:
  - Checked for CSS syntax regressions by reviewing exact diff.
  - Confirmed these selectors are not overridden in responsive media queries, so the rhythm update applies consistently on desktop and mobile breakpoints.

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
