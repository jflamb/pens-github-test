# Project Notes: FDIC Information and Support Center Prototype

## Product Scope (Current)
Primary pages in `sites/fdic-public-information-faq`:
- `index.html` (support home)
- `report-problem.html` (progressive intake)
- `review-submission.html` (review/deflection)
- `submission-confirmation.html` (confirmation)
- `view-cases.html` (local case history)
- `faq.html` (FAQ browsing/search)

## IA and Navigation Decisions
- `index.html` is the top-level hub.
- All core flows provide return path to support home via breadcrumb/action.
- Primary support nav options:
  - Report a Problem
  - Ask a Question
  - Get Help with a Failed Bank
  - View My Cases
- FAQ is a self-service deflection path and is also used during review.

## Intake Form Architecture
Implemented in `support-intake.js`.

### Intent modes
- `report`
- `ask`
- `failed`

### Required fields (current)
- `intent`
- `topic`
- `details`
- `outcome`
- `residentState`
- `contactMethod`
- `contactValue`

### Progressive disclosure behavior
- Topic/outcome/state/contact sections are revealed after intent/topic selections.
- “Review your submission” remains disabled until required fields are complete.
- Progress card reflects completion status by section.

### PII policy in prototype
- Keep collection minimal.
- Collect only follow-up contact method/value and state.
- Warn users not to enter SSNs/full account numbers in free text.

## Review/Deflection Behavior
Implemented in `support-review.js`.
- Review page presents captured selections before submit.
- “Related FAQs” uses real question-level suggestions from `data.json`.
- Suggestion links deep-link to concrete FAQ entries (`faq.html#faq-...`).
- Fallback to keyword links only when FAQ data load fails.

## FAQ Experience
Implemented in `script.js` + `faq.html`.

### Behavior
- Search + topic filter.
- Single-select ARIA-tree-like sidebar behavior.
- Question copy-link action.
- Deep-link hash handling opens target details and scrolls into view.

### Content display decisions
- Removed visual `Q:` and `A:` prefixes.
- Topic badges can be hidden without deleting data markup.
- Hover/focus affordances tuned for readability and whitespace.

## Persistence Model (Prototype)
### Storage keys
- Draft: `fdicSupportIntakeDraft` (sessionStorage)
- Last submission: `fdicSupportSubmittedCase` (sessionStorage)
- Case history: `fdicSupportCaseHistory` (localStorage)

### Case behavior
- Submit generates case ID and stores summary metadata.
- `view-cases.html` reads browser-local history only.

## Accessibility/UX Notes

## Session Learnings (2026-02-26)

### Canonical page model
- `index.html` is now the canonical intake page (not a marketing/home hub).
- `report-problem.html` remains a compatibility entry point and can forward/preserve mode query usage.
- Keep breadcrumb/page title semantics aligned with actual page purpose to avoid "Report a Problem" labeling when users enter via other intents.

### Left rail IA pattern (standardized)
- Left rail is now:
  - `Information & Support Center`
  - `Frequently Asked Questions`
  - `View My Cases`
- This same nav should appear on intake, FAQ, and cases pages.
- On FAQ, topic tree lives beneath the global support nav in the same left rail.

### Progress model (single source of truth)
- Progress should not be duplicated in nav and panel.
- Progress panel behavior:
  - Hidden until user selects an intent (`report` / `ask` / `failed`).
  - Shows only currently visible sections (conditional disclosure aware).
  - Items behave as in-page anchors for visible sections.
- Sticky behavior is applied to `.report-side-rail` (more reliable than sticky on inner tracker in current layout).

### In-flow FAQ deflection pattern
- Show contextual FAQ suggestions only after topic selection.
- Suggestions should be real question links to `faq.html#faq-...`, not topic-only links.
- Include a clear escape hatch link: "Browse all FAQs".
- Spacing needs explicit list-bottom gap before "Browse all FAQs".

### Content callout styling decision
- For full-width form sections with constrained text, avoid full background-filled boxes that create awkward right-side whitespace.
- Adopt inset/callout style:
  - left rule only
  - no fill
  - no full border
  - constrained readable measure for text (currently ~68ch)
- Use neutral FDIC gray accent for inset rules to avoid excessive navy bars competing across the page.

### Cases page improvements implemented
- Added "Sort by recency" control (`Newest first` / `Oldest first`) with timestamp-based sort.
- Added stronger empty state with next actions:
  - start a request
  - browse FAQs
- Disable sort control when there are zero cases.

### Routing copy behavior (prototype)
- Bottom routing sentence is rule-based in `support-intake.js`:
  - selected topic provides `endpointKey`
  - `endpointKey` maps into static `ENDPOINTS` object (`label`, `queueCode`)
- This is not backend routing; it is deterministic prototype logic.

### Known gotchas
- If progress appears before intent selection, verify:
  - no `?mode=` query preselecting intent
  - tracker has both `hidden` attribute in HTML and inactive guard class behavior in JS/CSS.
- Browser cache can present stale component behavior; use cache-busting query params during QA.
- Preserve strong visible focus states.
- Avoid clipped focus rings and border/fill misalignment.
- Use fieldset/legend semantics for grouped controls.
- Keep plain-language labels and instructional copy.

## Styling/Brand Notes
- Header/footer and typography aligned toward FDIC production look.
- Share bar uses production-like gradient direction: `white -> #f7f7f3 -> white` with top/bottom borders.
- Sidebar active marker is rounded, inset, and visually distinct.

## Known Constraints
- Static front-end prototype (no authenticated backend).
- “View My Cases” not cross-device and not identity-backed.
- Routing destinations are internal queue labels/codes.

## Recommended Next Technical Steps
1. Add authenticated API-backed case storage.
2. Add server-side validation/sanitization for free text and contacts.
3. Add analytics for FAQ deflection and submit conversion.
4. Add privacy/retention notice for contact collection.
5. Add integration tests for progressive gating and FAQ deep links.
