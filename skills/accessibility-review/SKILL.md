---
name: accessibility-review
description: Use when reviewing UI keyboard access, focus, accessible names, structure, contrast and motion behavior.
---
# Accessibility review

[Português (Brasil)](SKILL.pt-BR.md)
Review the implemented primary flow and relevant recovery states using the [browser validation contract](../../references/browser-validation.md).
Check semantic landmarks/headings, meaningful names, label/input and error associations, focus visibility, focus order/restoration, keyboard activation and escape behavior, contrast, zoom/reflow and reduced-motion behavior.
Calibrate supported native keyboard input with observable focus/activation changes. A named press_key API without changed behavior is insufficient. Try one documented native alternative when available, then mark unsupported if it fails; dispatchEvent and scripted focus are not trusted keyboard evidence. Use actual browser actions for keyboard claims. Inspect overlays and validation. A screenshot alone cannot prove focus order or assistive technology behavior.
For solid backgrounds, calculate contrast from actual computed foreground/background colors, including opacity/inheritance/compositing; use pixel analysis where complex backgrounds require it. Record method, colors, ratio and scope.
Run existing accessibility automation when available; record its scope and result. Do not add a tool dependency solely to claim coverage.
Classify issues as blocker/major/minor with evidence and repair; retest affected behavior after fixes.
Record unsupported checks as pending. Automated scans and limited manual checks do not establish complete WCAG conformance. Do not declare global compliance without the required scope of audit.
