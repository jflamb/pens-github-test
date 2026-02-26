# TODO

## Current Task (FDIC Hero Heading Pattern)
- [x] Apply gold section subtitle (`Information and Support Center`) in page hero regions.
- [x] Set page/task title as `h1` in hero area on task pages.
- [x] Remove duplicate in-content `h1` headings where hero already carries the page title.

## Review / Results (FDIC Hero Heading Pattern)
- Updated intake, review, cases, confirmation, and legacy step page templates to use:
  - hero subtitle: `Information and Support Center`
  - hero `h1`: page/task title
- Kept existing `support-intro` copy under hero titles where applicable.
- Preserved JS bindings by keeping `#intake-heading` and `#intake-subcopy` IDs on the intake page after moving them to the hero region.
- Verification:
  - Reviewed resulting heading structure and duplicates across HTML templates.

## Current Task (Task-First Page Headings)
- [x] Make each page's `h1` the primary task/action heading.
- [x] Remove redundant section-level `h1` headings where a task heading exists in content.
- [x] Preserve existing visual scale by applying task-heading styles to `h1` in report-main areas.

## Review / Results (Task-First Page Headings)
- Updated intake, review, cases, confirmation, and legacy step pages to use task-first `h1` headings.
- Removed redundant top-of-page `Information and Support Center` headings on task pages.
- Updated CSS selector scope so `.report-main h1` receives the same spacing as prior `.report-main h2`.
- Verification:
  - Reviewed heading hierarchy across page templates with grep (`<h1`, `<h2`).

## Current Task (FAQ Relevance Narrowing)
- [x] Add context narrowing by selected intent/topic before lexical FAQ ranking.
- [x] Keep lexical scoring in place as a secondary ranking signal.
- [x] Preserve graceful fallback when context filters are too narrow.

## Review / Results (FAQ Relevance Narrowing)
- Added intent/topic-to-FAQ-topic context mapping in review scoring.
- Candidate pool now narrows to context-matching FAQ topics when enough matches exist, then applies lexical scoring.
- Added context-match score boost so aligned topics are preferred even when fallback to full pool occurs.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-review.js`

## Current Task (Review Page Callout Cleanup)
- [x] Replace duplicate "Before you submit" framing with concise, non-repetitive copy.
- [x] Reuse intake-page inset callout styling for the review FAQ and notice blocks.
- [x] Keep FAQ deflection and legal links intact while simplifying language.

## Review / Results (Review Page Callout Cleanup)
- Updated review FAQ callout to use the same inset left-rule treatment as the intake page.
- Rewrote FAQ and legal notice copy to be shorter and less repetitive.
- Preserved FAQ suggestion list IDs and all legal-policy links.
- Verification:
  - Reviewed rendered-structure diff for class/ID continuity.

## Current Task (DIR Intent Split)
- [x] Add a dedicated fourth top-level intent for DIR-directed requests.
- [x] Restore general wording for `Ask a question or get guidance`.
- [x] Move DIR-specific topics under the new intent while keeping routing and review hints coherent.

## Review / Results (DIR Intent Split)
- Added new `dir` workflow and intent option in intake flow.
- Restored general ask intent detail copy and removed DIR-heavy phrasing from that option.
- Added DIR-specific topic options under the new workflow, all routed to `fdicdirform`.
- Updated review-page fallback FAQ hints for new `dir` intent and DIR topic keys.
- Verification:
  - `node --check sites/fdic-public-information-faq/support-intake.js`
  - `node --check sites/fdic-public-information-faq/support-review.js`

## Current Task (CTA Typography Alignment)
- [x] Match `Review your submission` button height to footer button sizing.
- [x] Increase CTA button font weight while keeping existing blue background.
- [x] Normalize completion-helper typography so it does not appear undersized.

## Review / Results (CTA Typography Alignment)
- Updated `.step-btn.next` to use large control height and heavier button typography consistent with footer buttons.
- Kept primary CTA blue fill (`var(--fdic-blue-800)`) unchanged.
- Updated `.report-submit-helper` to body-size text for stronger visual consistency.
- Verification:
  - Reviewed CSS diff and selector scope.

## Current Task (Form Rhythm Pass 2)
- [x] Rebalance intake spacing between headings, legends, and option groups.
- [x] Increase radio-card internal spacing and row gaps for readability.
- [x] Improve separation between helper text and CTA actions.

## Review / Results (Form Rhythm Pass 2)
- Increased spacing cadence across form sections and fieldset legends.
- Increased option-grid row/column gap and option-card padding for less visual crowding.
- Increased helper-to-actions separation so the CTA row does not feel cramped.
- Verification:
  - Reviewed exact CSS diff for selector scope and consistency.

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
