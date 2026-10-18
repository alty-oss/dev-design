# Project design artifacts

[Português (Brasil)](pt-BR/workflow.md)
Write inside docs/design/<slug>/ of the project being changed. Slug: lowercase letters, numbers and hyphens. Small adjustments may use only review.md and evidence.json. Artifacts are context, not automatic permission. Follow the [browser validation contract](../references/browser-validation.md); operational validation is current acceptance scope and human review is optional.

## brief.md
Product:
Audience:
Primary job:
Observable success:
Real content and clearly labeled samples:
Existing design system:
User constraints:
References and source:
Assumptions:
Open material decisions:

## direction.md
Decision status: proposed | approved | delegated
Decision source: the message or instruction supporting the status
Chosen direction and reason:
Alternatives and trade-offs, for new products/redesigns:
Colors: 4–6 named hex values
Typefaces, roles, fallback and scale:
Layout concept, alignment and ASCII wireframe:
Distinctive principles:
Specificity review: generic choice found, revision and reason
Existing identity preserved:
Asset/font dependencies:

## flows.md
Main flow: entry → action → feedback → success → recovery
State matrix: component | loading | empty | error | success | disabled
Every non-applicable cell includes a reason.
Keyboard order, focus and restoration:
Narrow-screen behavior and content priority:
Component purpose, variants and API:
Action vocabulary and microcopy:

## tokens.json
Use schemaVersion 1 and semantic roles. This example is a shape, not a palette recommendation:
{"schemaVersion":1,"color":{"surface":"#FFFFFF","text":"#182026","action":"#005EA8","focus":"#005EA8"},"typography":{"body":{"family":"system-ui","size":"1rem","lineHeight":1.5}},"spacing":{"unit":"0.25rem"},"radius":{"control":"0.25rem"},"motion":{"duration":"120ms","reduced":"none"}}
If an existing token applies, use its reference and record where it is defined.

## review.md
Task and scope:
Project revision: changed project's root | actor/tool and command | observed commit or availability reason | changed-file SHA-256 hashes
Resolve Git from the directory of the code being changed, including projects nested inside an editor workspace. Use `git -C <project-root> rev-parse --show-toplevel` and `git -C <project-root> rev-parse HEAD`, or documented equivalent tools. The plugin's repository and the workspace's current shell directory are not substitutes for the changed project's repository. Record the actual output. If Git, permission or the commit lookup is unavailable, state that specific limitation and record source hashes; a failed lookup in another directory does not establish that this project has no commit.
Findings: id | severity (blocker/major/minor) | criterion | observed issue | evidence | repair | status
Checks: actor/tool | command/action | actual result | recordedAt from clock | limitation
Preview: actual command | root | URL | PID | owner | cleanup
Capture calibration: requested viewport/pixel ratio | measured dimensions | supported alternate attempted | image inspection
Keyboard calibration: native action | observable change | one native alternative | limitation
Timing: actual observed state/conditions | bounded timeout | unavailable transient captures
Repair rounds:
Remaining issues:
If browser access is unavailable or a check has not been performed, that check MUST remain pending. Never invent a pass.

## evidence.json
Use this initial record; replace pending checks only after observing them.
{"schemaVersion":1,"projectRevision":{"commit":null,"files":{}},"captures":[],"checks":[{"id":"visual","result":"pending","reason":"Not yet observed"}]}
projectRevision.files maps changed project-relative paths to SHA-256. If the tree is dirty, include hashes even when commit is present.
Each capture: file, sha256, format (png|jpeg), mime (image/png|image/jpeg), dimensions (width,height), revision (exact commit plus dirty hashes, or source hash), route, viewport (width,height), state, kind (viewport|full-page|clip), clip (x,y,width,height or null), actor, tool, capturedAt (ISO-8601 from actual tool provenance or null), captureProvenance (receipt/source or null), recordedAt (actual collector clock), notes.
Use record-capture.mjs as documented in browser validation to validate existing unchanged PNG/JPEG metadata from actual bytes; matching dimensions does not establish visual inspection or detect repeated strips. A clip is only regional evidence. Preserve raw tool receipts and record visual inspection separately. After edits, preserve historical raw captures and their SHA-256 unchanged. Keep revision-specific evidence files so historical revision metadata stays unchanged. Annotate notes in the current record about obsolescence; affected current checks return to pending. Add evidence for the current revision. Do not add a stale result enum.
Each check: id, result (passed|failed|pending), reason, evidence (path or recorded action).
Use condition-based checks on real product timing, without monkey-patching timers. Native keyboard claims require observed focus/activation; synthetic events are diagnostic only. Only reference files that exist. A captured screenshot is not proof of keyboard behavior.

## handoff.md
Outcome and affected screens:
How to run/review:
Decisions and rationale:
Evidence paths and tested revision:
Checks actually completed:
Open defects and pending checks:
Material dependencies/risks:
Next action if a check could not run:

## Revision-specific evidence example
Before editing revision A, preserve its `evidence.json` as `evidence-revision-a.json` with unchanged contents and keep `desktop-a.png` unchanged, including its SHA-256, capturedAt and provenance. After changing the form to revision B, create the current `evidence.json` with schemaVersion 1 and revision B commit/dirty hashes. Its notes (in a capture record) or review.md explain: "desktop-a.png belongs to revision A and does not validate revision B." Do not rewrite historical capture metadata to revision B.

Current affected check, before a new observation:
```json
{"id":"visual","result":"pending","reason":"The form changed after the historical capture; revision A does not validate revision B.","evidence":"review.md"}
```
Only after observing revision B add a new capture, its actual hash/provenance and the resulting current check. Keep `evidence-revision-a.json` and raw image intact; future archival files follow the same revision-specific pattern. Missing capture time stays null; never invent a timestamp. See the [usage workflow](../docs/usage.md#resuming-with-historical-evidence).
