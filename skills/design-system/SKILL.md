---
name: design-system
description: Use when mapping existing UI tokens/components or defining a coherent token and component contract for implementation.
---
# Design system

[Português (Brasil)](SKILL.pt-BR.md)
Inventory current components, tokens, type, spacing and interaction conventions first. Reuse before adding a parallel system.
Write tokens.json and component decisions using the [artifact contract](../../templates/workflow.md). Map semantic roles to existing token references when available; otherwise define compact values aligned with direction.md.
Cover color roles, typography, spacing, radius and motion. Define focus and disabled treatments. Distinguish surface/text/action/status roles.
For each affected component record purpose, API/variants, states, responsive rules and accessible behavior in flows.md or direction.md.
Do not introduce a UI library or font dependency without checking the current stack and the user's constraints. Preserve explicit brand choices.
