# Cursor usage pending-work map

English | [Português (Brasil)](../pt-BR/plans/2026-10-17-cursor-pendencias.md)

Date: 2026-10-17. Examined baseline: commit `7be3178`, plugin `design` version `0.1.0`.

> Historical assessment before the Alty migration. Recorded versions, commits, and observations apply to their original revisions and do not certify the migrated repository.

The request was to examine gaps and plan implementation. The user reported no difficulties and wanted easier plugin installation. Installation usability is therefore a requested improvement; validation limits below are not reports of current user failures.

## Evidence from this review

| Check | Observed result | Scope |
| --- | --- | --- |
| Git tree before work | No local changes | Assessment baseline. |
| Node.js environment | `v24.21.0` | Meets minimum Node.js 22 requirement at that time. |
| `npm test` | 46 passed, zero failures | Includes actual helper/packaging operations in temporary repositories. |
| `npm run verify` | `package OK` | Identity, versions, local references, integrity. |
| Environment local-plugin directory | `~/.cursor/plugins/local` existed and was empty | No local copy available to compare. Does not prove absence of marketplace/other-scope installation. |
| Cursor execution in this review | Not performed | Discovery, prompts, keyboard, screenshots pending. |
| Remote CI/public download in this review | Not consulted | Local tests do not establish public-release state. |

The [official Cursor documentation](https://cursor.com/docs/plugins), consulted on 2026-10-17, confirmed the local-plugin path, editor reload, and Customize check. Marketplace installation depends on distribution through that channel; publication requires Cursor review. This supports simplifying local installation now and preparing submission later. No public listing for this plugin was established in the review.

## Prioritized inventory

P0: first usability delivery or validation prerequisite. P1: next delivery. P2: later expansion. Status describes available evidence, not bug severity.

| ID | Priority / nature | Gap / impact | Evidence | Closure criterion |
| --- | --- | --- | --- | --- |
| INS-01 | P0 · user request | Shorter, clearer first installation. Current steps require download, checksum, extraction, hidden folder, destination, reload. | [Installation](../installation.md) and user request during review. | Recommended numbered route, clear requirements, copyable command, first usage confirmed in fresh session. |
| INS-02 | P1 · proposed improvement | Automate copying/checking local installation, including updates with backup. Baseline had no installer. | [Available scripts](../../package.json), clone's `scripts/release-files.json`, manual guide steps. | Dependency-free installer tested with temporary destinations, no version merging, diagnostics distinguishing disk from editor discovery. |
| INS-03 | P2 · external channel | Prepare marketplace distribution for installation through Cursor UI. | Official channel documentation; publication not established in review. | Validated candidate, recorded submission, and listing installation observed only after approval. |
| CUR-01 | P0 · environment/validation | Confirm actual installed copy, nine skills, rule, `/design` origin; otherwise editor-executed copy is unknown. | Empty local directory; [validation record](../runtime-validation.md) pending at baseline. | Customize shows origin and ten expected components; `/design` matches tested version. |
| CUR-02 | P0 · validation | Separate sessions for small adjustment, automatic UI routing, non-UI control. | [Current protocol](../runtime-validation.md), [rule](../../rules/design-router.mdc), [main skill](../../skills/design/SKILL.md). | Adjustment preserves existing system; UI request follows workflow; non-UI task creates no design stages/artifacts. |
| CUR-03 | P1 · validation | Verify new feature, redesign, delegated decisions without requiring full workflow for every adjustment. | [design](../../skills/design/SKILL.md), [art-direction](../../skills/art-direction/SKILL.md), [usage](../usage.md). | Observed runs preserve identity, scale stages, record approval/delegation source. |
| CUR-04 | P1 · validation | Observe preview, captures, responsive behavior, real states, native keyboard; tested helpers cannot replace these observations. | [Browser contract](../../references/browser-validation.md), [visual review](../../skills/visual-review/SKILL.md), [accessibility](../../skills/accessibility-review/SKILL.md). | Current evidence distinguishes metadata, inspected image, interaction, DOM, unavailable checks. |
| CUR-05 | P0 · validation environment correction | Reproduce/fix automation, capture, authentication blockers, then validate discovery/prompts. | Historical Cursor 3.25.6/macOS, stale accessibility state, invalid IDs, ScreenCaptureKit `-3811`, unauthenticated CLI in [Validation](../runtime-validation.md). | AMB-01–AMB-05 closed with before/after evidence; fallback/diagnosis alone is not a fix. |
| CUR-06 | P1 · documentation/validation | Clarify stale evidence during resumption. Contract marks evidence `stale`, while check example only admits `passed`, `failed`, `pending` without full resumption example. | [Template](../../templates/workflow.md), [handoff](../../skills/design-handoff/SKILL.md). | Example preserves history, current check `pending`, explains differing revision, no silent schema change. |
| CUR-07 | P1 · repeatability | Expand smoke test with cases/prompts/standard records for version comparisons. | Six-step baseline protocol; [existing tests](../development.md) cover code/helpers/package, not editor conversations. | Identified cases, reproducible input, observable criteria, per-run/environment record. |
| CUR-08 | P1 · compatibility/runtime | Establish Node.js 22/24 execution; Windows/Linux install/workflow; update/rollback. | [Current limitations](../runtime-validation.md), observed local Node 24, baseline Linux/Node 22 CI configuration in clone. | AMB-06–AMB-07 and actual system matrix; configuration or CRLF test alone is not execution evidence. |

## User-cited environment corrections and checks

The following detail CUR-05/CUR-08 without changing the 11 main items. This inventory records initial state; implementation follow-up is at the end. Historical editor failures must be reproduced or their current resolution established before choosing a correction.

| Subitem | Required action | Closure criterion | Plan task |
| --- | --- | --- | --- |
| AMB-01 · stale accessibility | Investigate tool-state updates, refresh after UI changes, correct automation sequence. | Reading tracks observed window changes without stale state. | 4A. |
| AMB-02 · invalid identifiers | Obtain IDs from current reading, correct selection/context before action. | Selection/action succeed with current IDs, including after UI change. | 4A. |
| AMB-03 · ScreenCaptureKit `-3811` | Minimal capture reproduction; investigate permissions/session/compatibility; fix identified cause and repeat. | Actual capture through affected mechanism, dimensions checked, image inspected. Working fallback does not close original error. | 4A and S07. |
| AMB-04 · unauthenticated CLI | Identify actual CLI, complete documented authentication, repeat minimal call. | Authenticated session/response observed, no repository credentials. CLI remains optional. | 4A. |
| AMB-05 · discovery/prompts without evidence | After environment recovery repeat nine-skill/rule discovery and prompts. | S01–S06 with actual executed-copy/revision evidence. | 4–5. |
| AMB-06 · Node.js 22/24 | Run suite/verifier on both; inspect candidate-commit CI; fix reproduced differences preserving Node.js 22 floor. | Result per version/commit; workflow configuration alone is not a test. | 7. |
| AMB-07 · Windows/PowerShell | Run install/helpers/workflow on actual Windows machine/VM; fix observed incompatibilities. | Windows install, update/rollback, discovery, usage recorded; CRLF test stays separate. | 7. |

Diagnosing a cause or documenting an alternative enables independent work but does not close a correction. Unresolved external dependencies stay open with owner, evidence, next action, resumption condition.

## Existing behavior

Instructions already cover proportional workflow, token preservation, direction approval/delegation, user-project artifacts, static-preview fallback, PNG/JPEG captures, evidence integrity, keyboard calibration, bounded attempts. Implementation should validate these before proposing a rewrite.

Capture recording consumes an existing image; no implicit requirement to make it a screenshot generator. Preview remains static. Missing host tools should produce explicit pending checks under existing contracts.

## Installation alternatives

| Alternative | Benefit | Limit | Proposed decision |
| --- | --- | --- | --- |
| Short guide for current ZIP/clone | Fast delivery, preserves existing routes. | Copy/update/diagnostics stay manual. | First task; wording ready for future installer. |
| Local installer included in ZIP | Avoids manual destination/hidden-folder copy and version mixing; supports checks/updates. | Needs Node.js 22+ and extraction; cannot confirm Cursor-loaded copy. | Main improvement workstream. |
| Cursor marketplace | Installs through editor UI. | Submission, review, approved-listing observation required. | Later workstream; do not block local improvement. |

The [implementation plan](2026-10-17-cursor-implantacao.md) details delivery, dependencies, acceptance. The original assessment did not execute these changes; later implementation is recorded below.

## Status after local implementation

Candidate 0.2.0 includes installer, diagnostics, backup/restoration, guides, S01–S09 protocol, run template, revision-based evidence example. Full results/limits are in [Validation](../runtime-validation.md).

| Items | Observed state | Still open |
| --- | --- | --- |
| INS-01/INS-02 | Guide/installer implemented; local installation and replacement/rollback tests executed | Complete first editor experience observed. |
| INS-03 | Marketplace data/checklist prepared | Submission, review, listing installation. |
| CUR-01/AMB-05 | Nine skills, rule, version, `/design` selection, local origin, S02–S06 observed in IDE; review/evidence/handoff checked | Unavailable tool checks remain separate in Validation. |
| CUR-02/CUR-03 | Non-UI control, adjustment, automatic routing, feature observed in IDE; S06 awaited choice then applied Bancada | Sign-off of visual/keyboard checks still unavailable per case. |
| CUR-04/AMB-03 | States, 390×844/1440×900 captures, keyboard observed in independent browser, including IDE result; native capture intermittently recovered then failed | Stable ScreenCaptureKit cause/fix and transient loading screenshot. |
| CUR-05/AMB-01–AMB-04 | CLI login tested; session renewal/window activation enabled actions/actual captures; recovery procedure documented | Native automation still inconsistent with `-3811`; cause unconfirmed. |
| CUR-06 | IDE S09 detected differing revision, preserved historical JSON/images byte for byte, repeated available checks without source edits | Current captures/unavailable checks pending; no old visual approval reused. |
| CUR-07 | Protocol/template/records for executed cases delivered | Complete unavailable checks using required environment in Validation. |
| CUR-08/AMB-06–AMB-07 | Remote CI passed Windows/Linux/macOS on Node.js 22.23.3/24.21.0; PowerShell ZIP/install/update/restoration observed | Graphical Windows/Linux Cursor discovery/workflow. AMB-06 closed at historical revision `ecac32b`; AMB-07 partial. |
