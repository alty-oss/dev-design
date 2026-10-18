# Implementation plan: simple installation and validated Cursor usage

English | [Português (Brasil)](../pt-BR/plans/2026-10-17-cursor-implantacao.md)

> Future execution: perform tasks in order, record results in checkboxes, and review each delivery before proceeding. Creating this plan does not make its proposed features available.
>
> Historical plan before the Alty migration. Its versions, commits, CI runs, and editor observations describe the recorded revisions; they do not establish validation or publication in the new repository. The Portuguese-first guideline below records the policy at the time; current maintained documentation is English-first with pt-BR mirrors.

**Goal:** simplify first-time installation and close verifiable Dev Design usage gaps in Cursor.

**Architecture:** preserve the instruction plugin and helpers. Add a local installer using native Node.js APIs, reuse `verify(root)`, and validate agent behavior in disposable projects. Marketplace distribution is a later workstream.

**Technology:** Node.js 22+, ESM, `node:test`, existing Git and packaging, without npm dependencies.

**Baseline:** version `0.1.0`, commit `7be3178`, [pending-work map](2026-10-17-cursor-pendencias.md). The user reported no current difficulties and requested simpler installation. All 46 tests and the verifier passed during the initial assessment.

## Global constraints

- Preserve `design`, `/design`, nine skills, and existing preview/capture interfaces.
- Keep versions equal in `package.json` and `.cursor-plugin/plugin.json`, with canonical metadata.
- Preserve bytes, hashes, licenses, and provenance in `vendor/frontend-design/`.
- Usage artifacts belong in the disposable/user project's `docs/design/<slug>/`; plugin plans belong in `docs/plans/`.
- Exclude personal paths, backups, credentials, private sessions, and executed test projects from distribution.
- Historical policy: keep public guides in Portuguese, valid local links, and required documents in the ZIP.
- Do not claim discovery, visual execution, keyboard, or compatibility without observation.
- Running tests must not automatically publish or submit the plugin.

## Order and milestones

| Milestone | Tasks | Delivery | Dependency |
| --- | --- | --- | --- |
| A · clearer start | 1 | Short guide using available mechanisms. | None. |
| B · assisted installation | 2–3 | Installer, diagnostics, tests, ZIP inclusion. | A. |
| C · recovered environment and Cursor pilot | 4, 4A, 5 | Verified automation/authentication recovery and discovery/workflows observed on macOS. | B; investigate environment in 4A before dependent editor actions. |
| D · reliable resumption | 6 | Consistent stale-evidence example and observed resumption. | C for editor evidence. |
| E · expansion and distribution | 7–8 | System matrix and release candidate; marketplace preparation. | B–D; other systems subject to access. |

A can ship before the installer. If Windows/Linux are unavailable, keep those cells pending and limit observed-support claims to the pilot environment. Do not estimate external approval time.

AMB-01–AMB-04 environment blockers can be investigated alongside documentation for tasks 1–4. S01 discovery and dependent cases pass only after the required capability recovers. Task 4A adds an explicit step to the original eight tasks.

## Task 1 — Shorten first installation

**Resolves:** INS-01. **Owner:** maintenance/documentation.

**Files:** update `README.md`, `docs/installation.md`, and `docs/troubleshooting.md`.

- [x] Lead the guide with a recommended path: download ZIP/checksum from the same version; check checksum; extract/copy for the system; reload and confirm origin in Customize. Reuse existing commands until the installer exists.
- [x] Separate first installation from update/rollback; keep clone as an alternative for Git users.
- [x] Before commands, explain required tools and three distinct success checks: intact folder, plugin discovery, working `/design`.
- [x] End with a copyable first request: `/design Corrija apenas o alinhamento deste botão. Preserve tipografia, cores e comportamento atuais. Registre o que conseguiu verificar.` This is the historical Portuguese prompt.
- [x] Check commands/links with `npm run verify`; run `npm test` to check documentation in the extracted ZIP too.

**Acceptance:** someone can locate the recommended route, prerequisites, confirmation, and recovery without developer guides. Record installation duration only after observing an actual session.

## Task 2 — Implement local installation with diagnostics and rollback

**Resolves:** INS-02. **Owner:** code maintenance.

**Files:** create `scripts/install.mjs` and `tests/install.test.mjs`; update `scripts/release-files.json`. Reuse `scripts/verify.mjs` without weakening rules.

**Proposed contract, implemented in this task:**

| Export | Input | Responsibility |
| --- | --- | --- |
| `inspectInstallation(options)` | `{ sourceRoot: string, targetRoot: string }` | Check source/destination without creating files. |
| `installPlugin(options, dependencies)` | `{ sourceRoot: string, targetRoot: string, replace?: boolean }`; optional `{ fs }` second argument, native operations by default | Install/replace; `replace` defaults to false. File-operation replacement supports failure tests. |

`sourceRoot` is the extracted-copy or clone root. Tests use an explicit `targetRoot`; CLI resolves Cursor's local folder and always uses native file operations.

Diagnostics return `{status, sourceVersion, installedVersion, differences, nextSteps}`. `status` is `missing`, `matching`, `different`, or `invalid`; `differences` contains relative paths. Installation returns `{status, version, backupPath}` with `installed`, `updated`, or `already-installed`; `backupPath` is null without a backup. Validation/write errors produce readable output and a nonzero exit code. Never claim the editor loaded the copy.

**Proposed CLI:**

```sh
node scripts/install.mjs --help
node scripts/install.mjs --dry-run
node scripts/install.mjs
node scripts/install.mjs --check
node scripts/install.mjs --replace
```

`--dry-run` describes operations without writes; `--check` inspects source/destination without writes; `--replace` authorizes replacing a different copy after backup. Unknown or conflicting flags fail. Without flags, install into a free destination or return `already-installed` when distributed bytes match with no extras. Different destinations/extra files require `--replace`. Reject symlink destinations.

- [x] First write temporary-directory tests for invalid source, missing destination, identical/different copy, and extra files. Always use temporary `targetRoot`, never the actual installation.
- [x] Implement diagnostics: `verify` source, read distribution list, compare versions/bytes, detect extras without following symlinks. Diagnostics must not open Cursor or inspect account data.
- [x] Validate every allowlist entry using packaging constraints: regular file, relative path inside root, no symlink, duplicate, or traversal. Reject source/destination equality or containment in either direction before mutation.
- [x] Copy only allowlisted files to staging outside `plugins/local`; verify before moving to `plugins/local/design`. Include listed hidden-folder content, exclude `.git` and research.
- [x] For replacement, move the entire old copy to a unique backup outside `plugins/local`, under `~/.cursor/plugins-backups/`. Then promote the verified copy. On failure, restore the previous copy and report the outcome; never automatically delete backups during installation.
- [x] Cover copied-file checksums, spaces in paths, symlinks, overlapping roots, invalid flags, no writes in `--check`/`--dry-run`, write failures, and restoration. Inject file operations to test promotion failure without exposing injection in CLI.
- [x] Distribute the installer itself and `scripts/release-files.json` so the extracted ZIP works without a clone. Exclude `tests/` from the usage package.
- [x] Run `node --test tests/install.test.mjs`, `npm test`, and `npm run verify`; check zero failures and extracted-package behavior.

**Acceptance:** no manual hidden-folder copy; updates preserve a backup and do not mix versions. The installer uses the local extracted copy: no remote download/execution, Node.js installation, or editor restart. ZIP checksum verification remains required; extracted-folder `verify` does not replace it.

## Task 3 — Deliver installer through ZIP and update quick start

**Resolves:** INS-01, INS-02. **Files:** update `tests/package.test.mjs`, `README.md`, `docs/installation.md`, `docs/troubleshooting.md`, `docs/development.md`.

- [x] In ZIP tests run `node scripts/install.mjs --help` from extraction; expect exit zero and documented flags.
- [x] Exercise extracted installer's exported function with a temporary destination; confirm ZIP completeness and installed `verify`.
- [x] Only then update short guide: download/check; extract/open terminal in `design`; run `node scripts/install.mjs`; reload/confirm in Cursor.
- [x] Show `--check` and `--replace`, generic backup location, recovery, missing/old Node, changed destination, denied permission, and different Customize origin.
- [x] Keep manual installation; distinguish Node needed for installer/helpers from instruction discovery by Cursor.
- [x] Run `npm test` and `npm run verify`, inspecting full output. At this historical stage, do not advertise an `npx`, extension-installer, or MCP installation command as installing this plugin.

**Acceptance:** published steps work from ZIP plus declared prerequisites. Confirm fresh installation and update without requiring Git.

## Task 4 — Standardize pilot and confirm discovery

**Resolves:** CUR-01, CUR-07. **Files:** create `docs/cursor-smoke-test.md`, `templates/cursor-validation.md`; update `docs/README.md`, `docs/runtime-validation.md`, `scripts/release-files.json`.

- [x] Create protocol/per-run record: actual date, OS, Cursor/plugin/Node versions, model, installed origin, commit/hashes, tools, case IDs, actions, observed result, limit, next step.
- [x] Prepare disposable project outside installation: name/email form, submit button, existing tokens, modal, validation/loading/error/retry/success, and non-UI `sum(a, b)`. Use labeled fictitious data and fixed actual loading duration; do not change timing for captures.
- [x] Save clean baseline and restore before independent cases. Record test-project revision as well as plugin revision.
- [x] Execute 4A before dependent automation/capture actions; distinguish recovered capability, fallback, and remaining blocker.
- [x] Run S01: install candidate, reload, verify origin, count nine skills plus `design-router` in Customize, and check `/design`.
- [ ] If another origin has the same name, record/select intended copy without automatically removing third-party plugins. Record any observed policy blocking local imports.
- [x] Include both new documents in ZIP allowlist; check links with `npm test` and `npm run verify`.

**Acceptance:** S01 observed against actual version; folder presence/installer success does not close it. Per-run records stay in the disposable project; only a summary without personal data enters `docs/runtime-validation.md`.

## Task 4A — Resolve known environment blockers

**Resolves:** CUR-05, AMB-01–AMB-04; prepares AMB-05. **Priority:** P0 for blockers preventing editor observation. CLI is an alternative; its recovery does not block a working main route.

**Owners:** validation executor; session holder for human login/permissions; tool maintainer for causes outside plugin.

**Files:** before/after in `docs/runtime-validation.md`; reproduced procedures in `docs/troubleshooting.md` and future `docs/cursor-smoke-test.md`. Change `references/cursor-adapter.md` only for a proven operational-sequence fix. Do not hide host failures by changing the plugin.

- [ ] **AMB-01 — Accessibility state:** record current Cursor/OS/automation versions; reproduce a simple change and check updated reading. Refresh through documented mechanism after changing window, panel, or content. Fix stale-state reuse; if provider remains stale, record minimal provider reproduction. Retest two successive changes and both readings.
- [ ] **AMB-02 — Identifiers:** record original action/error, select correct window/panel, obtain ID from current reading. Do not reuse invalidated IDs. Repeat selection/action before and after UI change. If fresh IDs fail, isolate provider issue instead of guessing/repeating blindly.
- [ ] **AMB-03 — ScreenCaptureKit:** reproduce minimal capture and exact error. Check documented session capture access/requirements; treat permissions/version compatibility as hypotheses without assuming macOS/Cursor cause. Correct only identified cause; restart/reauthorize only required component when diagnosis supports it. Repeat capture, check dimensions, inspect image. Fallback may enable S07 but original error stays open until recovery proof or confirmed external resolution.
- [x] **AMB-04 — CLI authentication:** identify executable/version/authentication through documented CLI. Complete required login with account holder; run minimal read-only call in disposable project. Record response/revision without secrets. If human action is needed, leave exact action pending; never simulate login or make CLI a prerequisite.
- [ ] For each item record earlier symptom, current reproduction, confirmed/unknown cause, applied action, affected version, retest, next owner. If no current reproduction, record successful sequence/environment difference without inventing historical cause.
- [ ] Repeat S01 after reading/action recovery, S07 after capture/keyboard recovery, and S02–S06 for AMB-05. Metadata or CLI response does not prove editor discovery.

**Acceptance:** AMB-01–AMB-04 have recovery proof or stay explicitly open. Fallback documentation, error explanation, or missing capability does not count as completed correction. Independent work may continue with traceable external blockers.

## Task 5 — Execute workflows and assess available tools

**Resolves:** CUR-02, CUR-03, CUR-04, CUR-05, CUR-07. **Files:** cases in `docs/cursor-smoke-test.md`; results in `docs/runtime-validation.md`; troubleshooting corrections only for reproduced diagnoses.

Each row uses a fresh session except S09, which resumes its specified run. S02–S06 start from restored baseline. S07 uses observed S05 implementation; S08 uses a separate session with an actually identified tool limitation. Prompts below preserve their historical Portuguese wording.

| Case | Input / action | Required observable result |
| --- | --- | --- |
| S02 · explicit adjustment | `/design Corrija apenas o alinhamento do botão de envio. Preserve tokens e comportamento.` | Small change without full brief/alternatives; review/evidence in test project. |
| S03 · UI without command | `Melhore a hierarquia visual deste formulário preservando nossos tokens.` | Observable UI workflow adoption; mentioning skill alone does not count. |
| S04 · no UI | `Explique a função sum(a, b), sem alterar arquivos.` | Explanation without design stages/artifacts. |
| S05 · feature | `/design Inclua validação, loading, erro com nova tentativa e sucesso; preserve os dados preenchidos e a identidade.` | Relevant states/recovery implemented; tokens reused; checks/limits recorded. |
| S06 · redesign | `/design Proponha duas direções para este formulário. Aguarde minha escolha antes de aplicar uma nova direção.` Then explicitly select/delegate. | Material alternatives and decision status/source; no new-direction application before response. |
| S07 · browser/keyboard | Preview, states, 390×844/1440×900 captures, Tab/Shift+Tab/Enter/Escape, modal focus. | Actual URL/root/PID/owner; inspected intact images; observed focus/activation; separate capability outcomes. |
| S08 · unavailable tool | Repeat review where capture or keyboard is actually unavailable. | Corresponding check `pending`, reason, limited fallback if available, next steps, independent checks continue. |

- [x] Record each run as `passed`, `failed`, or `pending`, with evidence/revision. Explain non-applicability without global success.
- [x] For S07 follow existing calibration/attempt limits; unavailable transient capture neither invalidates separate DOM observation nor becomes an approved screenshot.
- [x] For S08 distinguish current tool limits from historical errors. Do not assume ScreenCaptureKit/login still fail or require authenticated CLI for plugin.
- [x] For bugs record minimal reproduction before patching; locate cause in discovery/manifest, routing, skill, helper, or external tool. Add behavioral regression for code; repeat editor case for instructions.
- [x] Repeat affected/dependent cases after correction; run `npm test` and `npm run verify` for repository changes. Stop only the preview started by that run.

**Acceptance:** S02–S06 observed without blockers; S07–S08 report each capability and reproducible limits. Do not claim completion without functioning host; independent documentation/installer work can continue.

## Task 6 — Clarify resumption and stale evidence

**Resolves:** CUR-06. **Files:** `templates/workflow.md`, `docs/usage.md`, `docs/cursor-smoke-test.md`; if needed for consistent explanation, `skills/ui-build/SKILL.md`, `skills/design-handoff/SKILL.md`.

- [x] Preserve `schemaVersion: 1` and current `result` values. Explain historical preservation and current checks returning to `pending` when changes invalidate old evidence.
- [x] Add concrete example: retain old capture/SHA-256, record staleness in `notes`, add new record/check without rewriting hash or inventing timestamp.

Current-check example after screen change:

```json
{
  "id": "visual",
  "result": "pending",
  "reason": "The form changed after the previous capture; the historical image does not validate the current revision.",
  "evidence": "review.md"
}
```

- [x] Run S09 after S05/S07: alter a form style and start a session with historical prompt `/design Retome docs/design/formulario e confira se as evidências ainda correspondem ao código atual.`
- [x] Confirm resumption recovers decisions, detects differing revision, preserves history, repeats affected checks or leaves them pending with reasons.
- [x] Run `npm test` and `npm run verify`; review usage/template/protocol links.

**Acceptance:** no new check enum or broken consumers; previous capture never validates changed screen.

## Task 7 — Expand matrix and verify version rollback

**Resolves:** CUR-08, AMB-06–AMB-07, INS-02 coverage. **Priority:** P1 for Node.js 22/24 and Windows; Linux editor remains compatibility expansion. **Files:** update validation/installation/troubleshooting from observations. Evaluate CI workflow only after checking each runner's test tools.

- [x] **AMB-06 local:** suite/verifier passed on Node.js 22.23.3 and 24.21.0 on macOS.
- [x] **AMB-06 remote CI:** execute `node --version`, `npm test`, `npm run verify` on isolated Node.js 22/24 environments at same candidate revision; record exact versions/output, reproduce/fix differences preserving Node.js 22 floor. Check actual candidate CI result; unavailable result remains pending. YAML configuration alone is not a pass.
- [ ] **AMB-07 Windows:** provide actual Windows machine/VM with PowerShell, Cursor, Node.js 22+. Exercise ZIP first installation, update, backup rollback, static preview, existing capture recording, then discovery/S02–S09 as tools allow. Correct reproduced path/process/command problems at source; repeat failed case. Missing tools differ from plugin incompatibility.
- [ ] Matrix for macOS, Windows/PowerShell, Linux: record Node, ZIP/clone, first install, update, rollback, discovery, S02–S09 separately.
- [x] On available systems, test installer with spaces in paths, `--check`, `--replace`, backup restoration per guide.
- [ ] Reload/check editor version/origin after every installation/rollback. File comparison alone is insufficient.
- [x] Run code tests on accessible systems; identify Git/unzip requirements before expanding CI. Do not add a matrix that merely skips relevant checks.
- [x] Keep unexecuted cells pending with required environment/next owner. Do not extrapolate Linux CI to Linux editor or `core.autocrlf=true` to actual Windows.

**Acceptance:** compatibility summary matches observed matrix exactly. Reproduced code bugs receive regressions; unavailable environment is not a bug.

## Task 8 — Prepare distribution and marketplace route

**Resolves:** INS-03, delivery of previous tasks. **Files:** review `CHANGELOG.md`, release guide, README, both manifests, release allowlist; follow existing release procedure.

- [x] Review A–D evidence/E limits; changelog records delivered behavior without promoting proposed work to available features.
- [x] Choose candidate version from final scope; update both manifests. Do not replace historical public `v0.1.0` tag/assets to distribute installer.
- [x] Run `npm test`, `npm run verify`; after reviewed commit generate `node scripts/package.mjs --output dist`. Expect ZIP/checksum with verified list/bytes; keep dirty-tree rejection.
- [ ] Extract into empty directory, verify checksum, run verifier/extracted installer; repeat S01/S02 from that copy before distribution.
- [x] Prepare marketplace identity, description, repository, license, components, evidence from [official reference](https://cursor.com/docs/reference/plugins); listing/approval remain external.
- [ ] After authorized/accepted submission, observe interface installation and `/design` origin; only then publish verified listing link in quick start. Retain ZIP alternative.

**Acceptance:** reproducible, reviewable candidate with explicit limits. Publication/submission follow candidate preparation under future-execution authorization.

## Program completion criteria

- [ ] Shorter installation observed with a new person/session; actual steps/time/errors, no target duration represented as result.
- [x] Installer/update tested; restorable backup; diagnostics separate from discovery.
- [x] S01–S06/S09 observed in pilot; S07–S08 capabilities/pending checks explicit.
- [ ] AMB-01–AMB-04 retested individually; fallback alone does not close automation/capture/login blockers.
- [ ] AMB-05 proven in editor; AMB-06 actual Node.js 22/24; AMB-07 observed Windows session or explicit environment dependency.
- [ ] Published system matrix with actual scope; empty cells never success.
- [x] Links/distribution checked; appropriate tests/verifier passing.
- [ ] Marketplace preparation, submission, approval tracked separately.

## Verification of this plan delivery

This plan/map were added to index/distribution list. Completed checkboxes reflect executed actions; editor-dependent acceptance remains separate. Documentation verification should run `npm test`, `npm run verify`, `git diff --check`. Executed outcomes appear below; open boxes preserve acceptance not fully observed.

## Implementation follow-up — 2026-10-17

| Delivery | Status | Evidence / limit |
| --- | --- | --- |
| Tasks 1–3 | Code/guides delivered | Installer/ZIP, backup/rollback tests; actual install created intact 0.2.0 copy. Complete editor experience remains separate acceptance. |
| Task 4 | Discovery/local origin observed in IDE | Nine skills, rule, version, `/design` selection, source file, response observed. |
| Task 4A | Partial recovery | Renewed session/window activation enabled prompts/actual captures; `-3811` and state disagreement recurred. No confirmed final cause/fix. |
| Task 5 | IDE prompts executed; completion per case in Validation | S02 CSS-only; S04 baseline intact; S03/S05/S06 completed review/evidence/handoff after connection resumptions without more source changes. S06 waited for choice; unavailable checks explicit. Independent browser also observed S05 with captures/keyboard. |
| Task 6 | Contract/example and IDE resumption observed; root/revision guidance strengthened | S02 retested correct commit/hash preserving earlier records. S09 detected style change, preserved historical JSON/images byte for byte, repeated available checks; current visuals pending. Both source retests unchanged. |
| Task 7 | Remote CI passed all six OS/Node combinations; ZIP/install/update/restoration observed in PowerShell | Historical commit `ecac32b`, run `39083379637` before migration. Graphical Windows/Linux Cursor pending. |
| Task 8 | Candidate 0.2.0 ZIP/checksum generated from clean commit and verified; marketplace data prepared | No publication/submission; editor prompts/remote outcomes separate from local package. |

See [Validation](../runtime-validation.md) for results and next steps for open historical items.
