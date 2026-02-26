# Lessons

Use this file to record correction-driven learning.

## Template
- Date:
- Trigger / correction:
- Root cause:
- Prevention rule:
- Actionable check for future tasks:

## Entries
- (Add entries as corrections happen)

- Date: 2026-02-25
- Trigger / correction: User flagged that endpoint forms had not been fully field-audited and suspected missing critical questions.
- Root cause: I completed routing/action-code normalization before finishing field-level parity validation across all terminal forms.
- Prevention rule: Do not claim pathway completeness until field-level inventories are captured for every form-bearing endpoint in scope.
- Actionable check for future tasks: For IA/form replacement work, produce a required-field matrix and gap report before finalizing intake schema decisions.

- Date: 2026-02-26
- Trigger / correction: User flagged FAQ rendering issues where generic link text ("website") remained inaccessible and context-based label mapping mislabeled CFPB links as FTC links.
- Root cause: Link-label resolution prioritized nearby sentence context over link destination, and list structure heuristics did not convert obvious sequential definition runs into semantic lists.
- Prevention rule: Prefer destination-first link labeling and only use surrounding context as fallback; add semantic list promotion rules for repeated structured lines separated by `<br>`.
- Actionable check for future tasks: For content-normalization changes, validate at least one representative mixed-agency link sentence and one BR-delimited sequence that should become an ordered or unordered list.

- Date: 2026-02-26
- Trigger / correction: User requested source-only FAQ cleanup with no render-time transforms; a broad first-pass rewrite over-mutated links before being rolled back.
- Root cause: Overly aggressive global rewrite rules were applied before isolating high-risk malformed patterns and validating against known outlier answers.
- Prevention rule: For large corpus HTML cleanup, run constrained transforms first, keep a local backup, and gate each rule with residual scans before expanding scope.
- Actionable check for future tasks: Always run pattern-based pre/post audits (`href` integrity, bare URL text, empty anchors, broken stubs) and spot-check known-problem `urlName` entries before finalizing.
