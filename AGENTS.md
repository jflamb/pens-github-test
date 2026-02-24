# AGENTS.md

## Scope
Operational guidance for agents working in this repo.
Detailed product/context history lives in `.context/project-notes.md`.

## Where To Start Each Session
1. Read this file.
2. Read `.context/project-notes.md`.
3. Review `tasks/lessons.md` for known pitfalls relevant to the request.
4. Create/update `tasks/todo.md` before non-trivial implementation.

## Workflow Orchestration Rules
### Plan node default
- Enter plan mode for non-trivial work (3+ steps, architectural decisions, or multi-file behavior changes).
- If execution deviates, stop and re-plan before continuing.
- Include verification steps in the plan.
- Reduce ambiguity with explicit specs up front.

### Subagent strategy
- Use subagents liberally for research, exploration, and parallel analysis.
- Keep one focused task per subagent.
- Prefer parallel exploration when it reduces risk or cycle time.

### Verification before done
- Do not mark done without proving behavior works.
- Validate changed behavior against prior behavior when relevant.
- Run available checks/tests and report any gaps.
- Hold output to staff-engineer quality: correct, minimal, explainable.

### Elegance (balanced)
- For non-trivial changes, consider whether there is a simpler/more coherent design.
- Avoid over-engineering simple fixes.
- Prefer root-cause fixes over patch layering.

### Autonomous bug fixing
- On bug reports, diagnose and fix directly with minimal user burden.
- Use logs/errors/tests to drive fixes.
- Resolve CI/test failures without waiting for step-by-step user direction.

## Task Management Contract
1. Plan first in `tasks/todo.md` with checkboxes.
2. Track status as work progresses.
3. Add a short review/result section when done.
4. After user correction, append a lesson to `tasks/lessons.md` with a prevention rule.

## Engineering Principles
- Simplicity first; touch the least code necessary.
- No lazy fixes; resolve root causes.
- Minimize blast radius; avoid regressions.
- Accessibility and plain-language requirements are first-class.

## Prototype-Specific Guardrails
- Top-level support page is `sites/fdic-public-information-faq/index.html`.
- Intake is progressive disclosure with required-field gating.
- FAQ deep links should expand and scroll to the target item.
- Legacy external form handoff is intentionally removed in this prototype.
- Case history persistence is currently browser-local and non-authenticated.

## Key Docs
- Detailed implementation history and decisions: `.context/project-notes.md`
- Current task plan/log: `tasks/todo.md`
- Cross-session lessons: `tasks/lessons.md`
