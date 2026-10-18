# Architecture

[Português (Brasil)](pt-BR/architecture.md)

[Documentation](README.md) · [Development](development.md)

Dev Design packages instructions and helpers for the Cursor agent. It does not maintain an application service, separate account, or backend. Work and its artifacts are produced inside the user's repository.

## Components and responsibilities

| Component | Location | Responsibility |
| --- | --- | --- |
| Manifest | `.cursor-plugin/plugin.json` | Identify plugin `design` and locate skills and rules. |
| Routing | `rules/design-router.mdc` | Guide workflow selection for interface work. |
| Skills | `skills/<name>/SKILL.md` | Stage-specific instructions; `design` is the main entrypoint. |
| References | `references/` | Tool, review, and provenance contracts. |
| Templates | `templates/workflow.md` | Structure of artifacts written in the user's project. |
| Third-party material | `vendor/frontend-design/` | Preserved visual guidance and license, with pinned hashes. |
| Helpers | `scripts/preview.mjs`, `scripts/record-capture.mjs` | Local static preview and metadata for an existing capture. |
| Verification | `scripts/verify.mjs` | Identity, versions, links, skill set, and integrity. |
| Installation | `bin/dev-design.mjs`, `scripts/install.mjs` | Shared CLI to check/copy distributed files, stage outside `plugins/local`, and replace with a recoverable backup. Does not prove editor discovery. |
| Distribution | `scripts/package.mjs`, `scripts/release-files.json` | Build and validate a ZIP from a clean commit; npm packages use an explicit file allowlist. Release tools remain in the source clone. |

## Execution flow

1. Cursor discovers the manifest and components.
2. The user selects `/design`, or the agent considers the rule for a UI task.
3. The main skill inspects the project and classifies the change.
4. Required skills read the context and tool contracts.
5. The agent changes the project and writes decisions/evidence under that project's `docs/design/<slug>/`.
6. Review records observations, repairs, and limitations; handoff explains how to continue.

Instructions guide the model; they are not a deterministic execution engine. Discovery and routing require [editor validation](runtime-validation.md).

## Tool boundaries

Preview serves only an explicit root on `127.0.0.1`, with an OS-selected port. It does not build, install dependencies, or publish the project. A session must stop only the process it started.

The capture recorder reads an existing PNG/JPEG image, validates structure/dimensions, and computes SHA-256. It does not generate images, alter bytes, or certify visual quality. See the [validation contract](../references/browser-validation.md).

## Source and installed package

The clone contains tests, workflows, and release tools. The ZIP contains only explicitly allowed distribution files under `design/`. npm exposes the `dev-design` executable; the installed plugin still lives at `plugins/local/design`. Required navigation documents accompany distributions; research, backups, and Git metadata do not.

Validation compares extracted files with the commit and reruns the verifier. Third-party material and provenance follow the [third-party notices](../THIRD_PARTY_NOTICES.md); presentation changes do not change that origin.

The installer accompanies the distributions, with the allowed file list. Staging uses `~/.cursor/plugins-staging/`, and backups use `~/.cursor/plugins-backups/`; only a verified copy is promoted to `plugins/local/design`. The installer itself does not download files, start the editor, or change system permissions. npm/npx obtains the package before invoking it. See [Installation](installation.md) for checking versions, updating, and restoring a backup.
