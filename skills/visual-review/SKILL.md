---
name: visual-review
description: Use after UI changes to inspect rendered screens, compare them to the brief and repair visual or interaction defects.
---
# Visual review

[Português (Brasil)](SKILL.pt-BR.md)
Read [browser validation contract](../../references/browser-validation.md), [quality rubric](../../references/quality-rubric.md), brief/direction and the implemented flow. Inspect the actual rendered result when browser tools exist.
Capture 390×844 and 1440×900; add 768×1024 for dense layouts. Check 320 CSS px and zoom for overflow/legibility when supported. Use relevant real loading/empty/error/success states and condition-based observations without changing product timers. If a transient capture is unavailable, mark it pending and record any separately observed DOM state.
Calibrate image dimensions once against the requested viewport; try one supported alternate method if faulty, then mark capture unsupported and continue independent checks. Record capture actor/tool, path, SHA-256, detected format/MIME, measured dimensions, kind (viewport/full-page/declared clip), route, viewport, state and exact tested revision in evidence.json. Use the capture recorder for metadata integrity, not a visual pass. capturedAt stays null without real tool provenance; recordedAt uses the actual recording clock. Inspect unchanged images for layout and artifacts. Never patch/crop to hide artifacts or use undocumented CDP/log fallbacks. A clip validates only its declared region.
Compare hierarchy, alignment, typography, spacing, visual identity, primary action, content and responsiveness against the brief. Exercise the main action and recovery path.
Write concrete findings with location, impact, evidence and repair. Fix blockers and major defects, mark affected prior evidence stale and recapture affected states.
Use two repair rounds by default. If defects remain, report them accurately and continue independent checks within the authorized scope; record unresolved decisions or unsupported checks without looping or waiting for optional reviewers.
If rendering or screenshot tools are missing, mark visual check pending, describe the limitation and provide reproduction steps. Do not claim the UI was visually validated.
