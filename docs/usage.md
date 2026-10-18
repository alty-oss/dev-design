# Usage

[Português (Brasil)](pt-BR/usage.md)

[Documentation](README.md) · [Installation](installation.md) · [Validation](runtime-validation.md)

Use `/design` as the main entrypoint. Explain the task, what must be preserved, and important states. The agent should inspect the project before selecting stages.

## Choose the workflow size

| Work | Expected behavior |
| --- | --- |
| Small adjustment | Preserve the existing direction, make the smallest justified change, and record the required review. |
| Interface feature | Understand the goal, reuse identity, define states/components, and implement. |
| New product or redesign | Prepare a brief, compare visual directions, and resolve material decisions before implementation. |
| Non-UI task | Continue normal work without unnecessary design stages. |

The agent should ask when a material decision is unresolved. If you delegate choices, it may decide and record that delegation. A file's existence does not equal your approval.

## Request examples

**Preserve an existing system**

> /design Improve checkout using our current tokens and components. Include declined payment, retry, and success. Preserve entered data and review keyboard navigation.

**Create a new screen**

> /design Create a registration page for reading workshops. The audience includes older adults. The primary action is choosing a workshop and registering interest. Use fictional content labeled as sample; propose the direction before implementation.

**Make a small adjustment**

> /design Fix only this button's alignment. Preserve the current typography, colors, and behavior. Record what you were able to verify.

**Resume work**

> /design Continue using the artifacts saved in docs/design/checkout. Check whether decisions and evidence still match the current code.

## The nine skills

| Skill | Responsibility |
| --- | --- |
| [`design`](../skills/design/SKILL.md) | Classify the task and coordinate the workflow. |
| [`design-brief`](../skills/design-brief/SKILL.md) | Record audience, primary job, content, and constraints. |
| [`art-direction`](../skills/art-direction/SKILL.md) | Define a context-specific visual direction. |
| [`interaction-design`](../skills/interaction-design/SKILL.md) | Organize flows, states, focus, and failure recovery. |
| [`design-system`](../skills/design-system/SKILL.md) | Define or reuse tokens and components. |
| [`ui-build`](../skills/ui-build/SKILL.md) | Implement in the project's existing stack. |
| [`visual-review`](../skills/visual-review/SKILL.md) | Inspect the result and record evidence-backed findings. |
| [`accessibility-review`](../skills/accessibility-review/SKILL.md) | Review accessibility aspects the tools allow observing. |
| [`design-handoff`](../skills/design-handoff/SKILL.md) | Deliver decisions, execution, evidence, and pending items. |

The `design-router` rule guides UI-task routing. Behavior depends on the model and host; see pending checks in [Validation](runtime-validation.md).

## Files produced in your project

Context lives in `docs/design/<slug>/` of the project being changed, separate from the plugin installation.

| File | Content |
| --- | --- |
| `brief.md` | Problem, audience, job, content, and constraints. |
| `direction.md` | Chosen direction, alternatives, and decision status. |
| `flows.md` | Flows, states, interactions, and focus. |
| `tokens.json` | Semantic tokens or references to the existing system. |
| `review.md` | Findings, checks, evidence, and limitations. |
| `evidence.json` | Revisions, captures, and checks with provenance. |
| `handoff.md` | Outcome, how to run, and next steps. |

Small adjustments may use only `review.md` and `evidence.json`. [Templates](../templates/workflow.md) define details. After code changes, affected evidence requires reassessment; old captures do not prove the new state.

## Tools and evidence

The plugin uses session capabilities. For static HTML and PNG/JPEG recording, see [Development — local helpers](development.md#local-helpers) and the [validation contract](../references/browser-validation.md).

Without reliable browser or keyboard tools, the agent should record the check as pending and continue independent work. Valid image metadata does not prove visual inspection, and synthetic events do not prove native keyboard navigation.

## Resuming with historical evidence

Keep `schemaVersion: 1` and results `passed`, `failed`, and `pending`. “Stale” describes evidence's relationship to the current revision; it is not a new `result` value.

1. Before changing revision A, preserve the record as `evidence-revision-a.json` unchanged, keeping raw `desktop-a.png` and its SHA-256.
2. After changing styling in revision B, create the current `evidence.json` with B's actual commit/hashes. In `review.md` and relevant `notes`, explain that A's capture is stale for B. The historical file retains its original revision, hash, date, and provenance.
3. Reset the affected current check to `pending`, for example `{"id":"visual","result":"pending","reason":"The form changed after the previous capture; the historical image does not validate the current revision.","evidence":"review.md"}`.
4. Repeat affected checks. If B can be captured, use a new file and actual hash/time; otherwise retain the pending item and next action. Do not rewrite old hashes or invent `capturedAt` (use null when unknown).

[Workflow templates](../templates/workflow.md) detail the contract. S09 in the [pilot](cursor-smoke-test.md) checks resumption in a fresh session.
