---
name: ui-build
description: Use when implementing a UI from an established brief, visual direction and interaction contract.
---
# UI build

[Português (Brasil)](SKILL.pt-BR.md)
Read the current brief/direction/flows/tokens relevant to the task and the [Cursor adapter](../../references/cursor-adapter.md) and [browser validation contract](../../references/browser-validation.md).
Use the existing stack, components and repository conventions. Reuse tokens and preserve product constraints. For a new direction, confirm the decision is approved or delegated before applying it.
Implement the primary flow and its loading/empty/error/success/disabled states. Use semantic structure, meaningful labels, visible focus, keyboard behavior and reduced-motion handling.
Use real content or labeled samples. Check CSS specificity and spacing conflicts. Keep asset and font loading resilient.
Run the project's appropriate existing checks. Do not invent a passing test or claim a nonexistent project command. For static HTML without a documented preview, use the explicit plugin loopback helper as documented in browser validation; record the actual command/URL/root/PID and ownership. Implement and verify small coherent slices.
After changes, update evidence with the commit and hashes of changed files. Preserve raw historical captures, hashes and revision metadata in separate revision-specific evidence files as described in the artifact contract. Annotate obsolescence in current notes/review; set affected current checks to pending until reobserved. Keep schemaVersion 1 and existing result values; never invent capture timestamps. Proceed to visual and accessibility review using the implemented result.
