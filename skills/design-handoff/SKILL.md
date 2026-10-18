---
name: design-handoff
description: Use when delivering a UI change with its decisions, verification evidence and remaining limitations.
---
# Design handoff

[Português (Brasil)](SKILL.pt-BR.md)
Use the [artifact contract](../../templates/workflow.md). Confirm evidence refers to the current code revision; after a visual change, preserve historical raw captures/hashes and unchanged revision-specific evidence files, annotate obsolescence in current notes/review and set affected current checks to pending until reobserved. Keep schemaVersion 1 and passed|failed|pending; do not invent capture timestamps or rewrite old revision metadata.
Summarize what changed and why, affected screens, how to run/review, decisions, evidence, checks actually completed and pending checks or defects.
Do not equate generated files, a build pass, screenshots or a score with complete professional quality.
If a blocker remains, report its impact and next action; do not call the result fully verified.
Keep the user-facing summary concise and link to review/evidence files. Do not publish, deploy, send messages or install integrations as an implicit delivery step.
