# Manual Cursor pilot

[Português (Brasil)](pt-BR/cursor-smoke-test.md)

[Documentation](README.md) · [Installation](installation.md) · [Observed results](runtime-validation.md)

This script does not record execution. Copy the [blank template](../templates/cursor-validation.md) into `docs/design/formulario/cursor-validation.md` of a disposable project outside the plugin installation. Record actual timestamps, versions, and revisions before cases; do not publish personal data. Prompt translations below are equivalent English scenarios; historical exact prompts remain in the preserved per-run receipts.

## Prepare a reproducible baseline

Create a test folder outside `plugins/local`, initialize Git, and prepare HTML/CSS/JavaScript or the existing stack. Include name/email fields, an initially misaligned submit button, existing color/type/spacing tokens, and a modal with opening, closing, and focus restoration. Use fictional names/emails explicitly labeled as samples. Include a non-UI `sum(a, b)` function returning their sum.

Set a real fixed 1500 ms submission delay and a sample-labeled simulated-failure control. Prepare validation/loading/error/retry/success paths for S05 implementation/inspection. Do not alter timing to obtain screenshots. Commit the baseline and record its hash. Before each independent scenario, restore only fixture files to baseline, preserving records outside restored files. Record commit and changed-file SHA-256 in each case.

Use a fresh session per case except S09. S02–S06 start from the restored baseline; S07 uses S05's result. Record plugin revision, installed source, and fixture revision separately. Do not perform a destructive reset in a user's project.

## Recover capabilities before dependent cases

For each AMB, record historical symptom, current reproduction, confirmed/unknown cause, action, version, retest, limitation, and owner/next action. Perform an initial reproduction and at most one retest after an evidence-based fix; persistent failures remain `pending`. Capture/keyboard calibration follows the specific limits of the [browser contract](../references/browser-validation.md).

| Item | Procedure and observable acceptance |
| --- | --- |
| AMB-01 · stale observation | Record OS, Cursor, and tool. Make a simple change, refresh through the documented mechanism, and compare with the window. Repeat with a second change. Both must appear. If the provider stays stale, record minimal reproduction; do not invent a historical cause. |
| AMB-02 · identifiers | Select window/panel and obtain IDs from a current observation. Act, change the interface, observe again, and repeat with new IDs. Record provider errors for freshly obtained IDs; never guess IDs. |
| AMB-03 · capture | Make a minimal capture and preserve the exact error. Check documented requirements, permissions, and versions as hypotheses. Fix only an identified cause; reauthorize/restart only when diagnosis warrants it. Retest, measure dimensions, and inspect the image. A documented alternative may enable S07 without closing the original issue. |
| AMB-04 · optional CLI | Identify executable, `cursor-agent --version`, and `cursor-agent status`. The account holder completes documented login if needed. Make a minimal read-only fixture call and record response/revision without credentials. Pending human login keeps this item open but does not block a working editor. |

If using the documented `cursor-agent --plugin-dir <plugin-path>` option in an isolated CLI session, record command/source/response as CLI evidence. Do not convert it into IDE discovery/execution. After recovering observation/actions, repeat S01; after capture/keyboard recovery, repeat affected S07 capabilities.

## Cases

Use `passed`, `failed`, or `pending` per case and capability. Non-applicability requires a reason, without global approval. Mentioning a skill does not prove workflow execution.

| Case | Exact prompt/action for a new run | Observable acceptance |
| --- | --- | --- |
| S01 · discovery | Install candidate; run Developer: Reload Window; open Customize and check source. In project: `/design Fix only this button's alignment. Preserve the current typography, colors, and behavior. Record what you were able to verify.` | Intended source/revision, nine skills, and `design-router` visible; selectable `/design` and observed response. Folder/installer alone do not close the case. Record competing sources and select the intended one without removing third parties. Explicitly record blocked imports. |
| S02 · adjustment | `/design Fix only the submit button's alignment. Preserve tokens and behavior.` | Small change, preserved tokens/behavior, no forced full brief/alternatives, and review in the project. |
| S03 · automatic UI | `Improve this form's visual hierarchy while preserving our tokens.` | Observable UI workflow in relevant actions/artifacts; identity preserved. |
| S04 · non-UI | `Explain sum(a, b) without changing files.` | Correct explanation, no design stages/artifacts, files unchanged. |
| S05 · feature | `/design Include validation, loading, error with retry, and success; preserve entered data and identity.` | States/recovery implemented, data preserved, tokens reused, checks/limitations recorded. |
| S06 · redesign | `/design Propose two directions for this form. Wait for my choice before applying a new direction.` Then: `I choose the first direction presented. You may apply it.` | Material alternatives; no new direction applied before selection; decision/status/source recorded. |
| S07 · browser/keyboard | `Open the S05 preview. Observe states, capture 390×844 and 1440×900, and check Tab, Shift+Tab, Enter, Escape, and modal focus.` | Actual URL/root/PID/owner, intact inspected images, observed focus/activation/restoration. Separate DOM/capture/keyboard results. Calibrate per contract; unavailable checks remain pending. |
| S08 · missing capability | In a separate session with capture/keyboard actually unavailable: `/design Review this form using available tools and record what you cannot verify.` | Affected check `pending`, actual reason, bounded alternative if available, next action, and independent checks continued. Do not assume historical errors or simulate unavailability as a real observation. |
| S09 · resume | After S05/S07, change styling and record the new revision. In a fresh session: `/design Resume docs/design/formulario and check whether evidence still matches current code.` | Decisions recovered, divergence detected, historical image/hash preserved, affected checks repeated or `pending` with reason. Use the [resume example](usage.md#resuming-with-historical-evidence). |

Record exact action, time, output/evidence, revision, limitation, and next action. Preserve minimal reproduction before fixing failures; repeat affected/dependent cases afterward. Stop only the preview started by that run. Detailed records belong in the fixture; public summaries omit private data and distinguish IDE, CLI, and code tests.
