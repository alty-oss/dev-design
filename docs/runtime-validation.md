# Validation and compatibility

English | [Português (Brasil)](pt-BR/runtime-validation.md)

Code verification and agent execution inside the editor are separate assessments. This page records what was observed and what still needs to be exercised.

> Historical evidence before the Alty migration. The commits, versions, CI runs, and editor observations below belong to the revisions described. They do not establish publication or validation of the new repository.

## Candidate 0.2.0 — 2026-10-17 execution

The candidate was implemented locally without publication. The installer was validated against temporary destinations and used to create an actual local copy; diagnostics returned `matching` for the 45 distributed files. Files on disk do not establish editor discovery.

| Check | Observed result | Limit / next action |
| --- | --- | --- |
| macOS arm64, Node.js 24.21.0 | 56/56 tests and `package OK` | Local candidate execution, including the installer and extracted ZIP. |
| macOS arm64, Node.js 22.23.3 | 56/56 tests and `package OK` | Temporary runtime from the official distribution, with verified SHA-256; no global downgrade. |
| Local installation | `installed`, then `matching`; source and destination bytes matched | Candidate 0.2.0 installed for the pilot. |
| Update / rollback | Real tests in temporary directories passed, including promotion failure and restoration failure with backup preserved | Files confirmed rollback; editor-observed rollback remains pending. |
| AMB-04 · CLI | Account holder completed login; a read-only call returned `CLI_OK` with exit code zero | CLI 2026.10.16-e3cb207; Auto model. Login and minimal response observed without exposing credentials. |
| S04 through CLI | Explained `sum(a, b)`; disposable project tree remained unchanged | Validates the non-UI control in that CLI session, not IDE discovery. |
| S02 through CLI | Localized button adjustment; review/evidence and visual/keyboard checks pending | First attempt timed out after shell refusal; a new session with automatic review completed. CLI and IDE results remain separate. |
| AMB-01–AMB-03 · native automation | Renewed session and window activation enabled typing, skill selection, and response reading. Actual JPEG captures of Customize, dialog, and execution were inspected; `-3811`, unavailable window, and disagreement between image and accessibility tree recurred | Partial recovery. Activation through the Window menu also allowed capture without established stability. Cause unknown; the original error remains open. One attempt using an old ID was a controller error, repeated with the current ID; it is not evidence of failure with fresh IDs. |
| S01 in IDE · discovery | Nine skills, `design-router`, version 0.2.0, and Local origin observed. `/design` selected in the menu; its chip opened `plugins/local/design/skills/design/SKILL.md`; adjustment response observed | Actual local origin confirmed in addition to the user-reported manual reload. Evidence exceeds folder presence. |
| S02 in IDE · adjustment | Prompt with selected skill removed only `#send{margin-left:21px}`; remaining bytes, tokens, and script preserved. Review, evidence, and handoff written in the test project | The agent kept viewport capture and keyboard pending after calibration/refusal. The review initially incorrectly claimed no commit; IDE retest corrected provenance and preserved old records byte for byte without source changes. An earlier exploratory attempt with duplicate prefix was recorded separately and did not replace the canonical prompt. |
| S04 in IDE · no UI | Correct explanation of `sum(a, b)`; all three baseline hashes unchanged and Git showed no changes | Independent session without design artifacts. |
| S03 through CLI | UI request without a command adopted the workflow and changed hierarchy while preserving tokens and 700ms loading | Installed context, Auto model; source identity checked without extrapolating to IDE. |
| S05 through CLI and integrated browser | States implemented; validation, loading, error, retry, and success observed with data preserved | First call timed out; resumption completed. Code records remain separate from browser observations. |
| S06 through CLI | Two directions proposed; screen source unchanged while awaiting selection | Application after selection was not exercised in that CLI call; IDE result recorded separately. |
| S09 through CLI | Detected style change, reset affected checks to pending, preserved historical file byte for byte | Previous hash checked against original receipt; unavailable new hashes recorded as unavailable. |
| S03 in IDE · automatic UI | Adopted workflow without a command and changed hierarchy while preserving five existing tokens and submission behavior | Review, evidence, and handoff completed after resuming the same conversation interrupted by connection failure. Commit/hashes checked; valid desktop/mobile captures. Native keyboard and some states remained pending in that session. |
| S05 in IDE · feature | Implemented field validation, loading, error/retry/success, `aria-busy`, data preservation, and a 700ms timer | Review, evidence, and handoff completed in the same conversation without further source changes; commit, hashes, and images checked. Agent checks and controller observations have separate authorship; controller confirmed success and keyboard in an independent browser. |
| S06 in IDE · redesign | Two materially different proposals; all three baseline files remained byte for byte unchanged before selection. Following controller selection for the test, applied Bancada and recorded approved direction with its source message | Review, evidence, and handoff completed in the same conversation; commit/hashes checked, valid mobile images. Desktop captures rejected for cropping/repetition; native keyboard and reliable timing remained pending. Selection belongs to the disposable fixture. |
| S09 in IDE · resumption | Detected surface change through diff and SHA-256, preserved historical JSON and both images byte for byte, recorded current commit/hash, and repeated interaction, reflow, and contrast checks without source edits | Historical images were not attributed to the new review; visual checks returned to pending. Current captures rejected for cropping/incorrect dimensions; keyboard, zoom, reduced-motion, and loading image remain pending. |
| S07 · current S05 result in independent browser | Empty validation, actual DOM loading, error, retry by Enter, success, and visible preserved data. Tab/Shift+Tab/Enter/Escape and focus restoration observed. Original JPEGs inspected at 390×844 and 1440×900; hashes/dimensions checked | IDE implementation source checked by commit/hash. First desktop image was empty after resize and rejected; retest after DOM inspection produced a valid image. No transient loading capture, zoom, or reduced-motion branch. Does not close native Cursor capture. |
| S07 · integrated browser | Original JPEG captures at 390×844 (error) and 1440×900 (success), pixel ratio 1, inspected and recorded with SHA-256 | Format checked by bytes despite `.png` filenames. Captures belong to the tested fixture revision; capturedAt stayed null without a capture-time receipt. |
| S07 · states and keyboard | DOM showed disabled/aria-busy during real loading; error/retry/success and validation observed. Tab, Shift+Tab, Enter, and Escape changed focus/modal opening; Escape restored focus | Integrated-browser keyboard established in that session; does not validate native Cursor window automation. |
| S07 · reflow and contrast | At 320px, scrollWidth equaled innerWidth; computed contrast of opaque white/blue button was 6.63:1 | Scope: fixture state and button. No global accessibility certification or unexercised zoom claim. |
| S08 / remaining limits | Native Cursor capture and transient loading screenshot remain pending | Loading observed in DOM; integrated-browser result does not close ScreenCaptureKit error. |
| CI Linux/macOS/Windows and Node.js 22/24 | Six jobs passed at commit `ecac32b`, with Node.js 22.23.3 and 24.21.0; tests, verifier, and ZIP executed | Historical remote run `39083379637`, before migration. Windows/macOS: 56 passed; Linux: 55 passed and one case-alias test inapplicable on case-sensitive volume. Zero failures. |
| Windows/PowerShell in CI | ZIP checksum checked and extracted using `Expand-Archive`; installation, `matching` diagnostic, replacement, and backup restoration executed on both runtimes | PowerShell 7 on an actual Windows runner. Tests also exercised preview, capture recording, and installer failure/restoration; excludes graphical Cursor. |
| Graphical Cursor on Windows and Linux | Not executed | CI establishes helpers on those systems; editor discovery/prompts require their own graphical sessions. |
| Marketplace | Data/checklist prepared in [Marketplace](marketplace.md) | Not submitted; approval and installation from listing remain external. |

The pilot also exposed a provenance gap: a review claimed “no commit” for a nested fixture that did have a commit. The cause was not confirmed. The artifact contract was updated to require the changed code root, command, output/limitation, and hashes. An agent in a fresh context located the correct commit and edit hash using the current guidance. After installing the updated ZIP, an IDE S02 retest also consulted the correct root and recorded the existing commit and source hash. Both old records were archived byte for byte; source remained unchanged. This confirms the retested case without guaranteeing every future model response.

The first remote execution exposed three Windows test failures: fixture setup used a temporary-directory representation different from the installer's native canonicalization. Setup switched to `realpathSync.native`, preserving fault injection and restoration assertions. Historical CI run `39062798814` recorded the reproduction; the passing run above includes the correction and additional PowerShell test. These are pre-migration records, not Alty CI results.

Operational instructions now require current observation after every action/window change, current IDs, and stopping a check when accessible state and image persistently disagree. A refusal must not be bypassed through another agent/interface. These improvements prevent incorrect claims; they do not establish a fix to the automation provider or ScreenCaptureKit.

CLI tests used the Auto model and independent disposable projects, with local reviews/receipts preserved outside the distribution. Shell, hash, and browser limitations are recorded separately; missing tools never counted as approval. The previous CLI preview stopped and its URL stopped responding. The five initial IDE pilot previews were stopped by their respective agents; independent verification confirmed absent PIDs and connection refusal on all five ports. S09's own preview also stopped. See the [S01–S09 protocol](cursor-smoke-test.md) and [per-execution template](../templates/cursor-validation.md).

## History — version 0.1.0

The historical **Dev Design v0.1** distribution combined the latest public code and guides in the repository before migration. Its internal version was `0.1.0`; numbering was consolidated without reverting functionality. The plugin identifier remained `design`, with nine skills preserved. Preview and capture helpers were unchanged.

During preparation, `npm test` passed **46/46 tests** and `npm run verify` returned **package OK**. Guide review checked distributed relative links, including anchors.

| Area | How to check | Evidence limit |
| --- | --- | --- |
| Code and helpers | `npm test` | Exercises code and actual helper operations; does not run the editor agent. |
| Identity, licenses, and links | `npm run verify` | Validates files/local references, including extracted ZIP. |
| Distribution | Generate ZIP and verify SHA-256 | Validates bytes/content without establishing Cursor discovery. |
| Version CI | GitHub Actions executions associated with commit/tag | Result applies to the execution's commit. |
| Nine skills and editor rule | Inspect Customize after reload | Reliable observation pending for that historical version. |
| `/design`, UI routing, and non-UI task | Separate sessions in disposable project | Editor execution pending for that historical version. |
| Captures, keyboard, and product states | Observe with available tools | Pending; not established by code tests. |

Historical CI and releases belonged to the repository before migration. New CI and release routes must be checked independently after migration. Packaging tests check the exact distributed document/file set, internal links, checksum, versions, and rejection of modified trees.

## Environment and known limitations

The historical attempt before the candidate used Cursor 3.25.6 on macOS. Automation returned stale accessibility state, invalid identifiers, and ScreenCaptureKit error (-3811). Evidence was insufficient to certify skill discovery or prompt execution. CLI fallback was unauthenticated. These results do not establish editor incompatibility.

For the historical 0.1.0 version, Node.js 22 was the CI target; local checks also ran on Node.js v24.21.0. The `core.autocrlf=true` test checks clone byte preservation, not full Windows execution. Documentation included PowerShell installation; an actual session still needed observation at that stage.

These limits are detailed as AMB-01–AMB-07 in the [pending-work map](plans/2026-10-17-cursor-pendencias.md). The [implementation plan](plans/2026-10-17-cursor-implantacao.md) covers environment recovery in task 4A, discovery/prompts in tasks 4–5, and Node.js 22/24 and Windows in task 7. Current status for those historical items is in the candidate record above; recording a diagnosis or fallback does not establish a fix.

## Smoke-test protocol

The [pending-work map](plans/2026-10-17-cursor-pendencias.md) records the 2026-10-17 local review. The [implementation plan](plans/2026-10-17-cursor-implantacao.md) proposes simpler installation and expanded cases. Their existence does not close pending editor checks.

1. Use a disposable project with a simple screen, known tokens, and a non-UI function.
2. Install the version being tested and confirm `design` origin in Customize.
3. In a fresh session, run `/design` for a small adjustment and check changed files/evidence.
4. In another session, request a UI improvement without naming skills and observe routing.
5. In a third session, request an explanation of the non-UI function and confirm no design stages.
6. Record actual plugin/editor version, model, tools, revision, and observed results. Mark unavailable checks pending.

## Validation history

Earlier history and attachments were backed up locally before repository consolidation. Editor observations described above remain known limitations without certifying execution of the current migrated version.
