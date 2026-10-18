# Development

[Português (Brasil)](pt-BR/development.md)

[Documentation](README.md) · [Architecture](architecture.md) · [Contributing](../CONTRIBUTING.md) · [Releases](releasing.md)

## Prepare the environment

Use Node.js **22.14.0 or newer**, Git, and `unzip`. The project has no npm dependencies to install. Git and unzip are also used by packaging tests.

```sh
git clone https://github.com/alty-oss/dev-design.git
cd dev-design
npm test
npm run verify
```

CI is configured for Linux, macOS, and Windows with Node.js 22 and 24. This matrix describes configuration; observed results and pending executions belong in [Validation](runtime-validation.md). The clone test using `core.autocrlf=true` checks line endings; it does not replace running all tests on Windows.

The preview shutdown test confirms process termination and HTTP-port closure on every system. POSIX also requires a graceful zero exit code. On Windows, `SIGTERM` terminates the process abruptly, without executing the POSIX signal handler.

## Available checks

| Command | Coverage |
| --- | --- |
| `npm test` | Verifier, identity, preview, PNG/JPEG, clone, installation, and packaging. |
| `npm run verify` | Names/metadata, versions, nine skills, local links, and preserved hashes. |
| `node --test tests/verify.test.mjs tests/identity.test.mjs` | Integrity and identity rules. |
| `node --test tests/install.test.mjs` | Installer in temporary destinations, diagnosis, backups, and failures. |
| `node --test tests/runtime.test.mjs` | Helpers with real HTTP, files, and processes. |
| `node --test tests/package.test.mjs` | Real ZIP, distributed documents, checksum, and extraction. |
| `npm pack --dry-run --json` | Inspect the npm file set without publishing. |

Run the complete suite and verifier before publication. For text-only changes, check links and document availability in the extracted package. Helper or workflow changes also require checks relevant to the behavior changed.

## Update documentation

- README: presentation, quick start, and guide navigation.
- `docs/`: installation, usage, architecture, maintenance, and limitations.
- `references/` and `templates/`: technical contracts consumed by skills.
- `skills/`: operational instructions with stable names/frontmatter.
- `docs/plans/`: decisions and plans, separate from current guides.

Write canonical documents in English and maintain Brazilian Portuguese counterparts. Root documents use `*.pt-BR.md`; guides mirror under `docs/pt-BR/`; references/templates mirror under their `pt-BR/` directories; skills use `SKILL.pt-BR.md` without changing runtime entrypoints. Add reciprocal language links and favor the reader's locale in navigation. Legal, provenance, and vendored source records remain canonical and unchanged.

Use relative links and avoid duplicating procedures: each detailed instruction should have a primary source. Add required documents to `scripts/release-files.json` and the npm allowlist. The extracted package must resolve its links without clone-only files.

## Local helpers

Prefer the preview command documented in the project. For static HTML without an existing command:

```sh
node /absolute/plugin/scripts/preview.mjs /absolute/project
```

Record the helper's actual URL, root, and PID. Stop your session's process with Ctrl-C when finished.

To record an existing capture without changing its bytes:

```sh
node /absolute/plugin/scripts/record-capture.mjs /absolute/project docs/design/example/desktop.png \
  --revision 'actual commit and changed-file hashes' \
  --route / --state idle --viewport 1440x900 --kind viewport \
  --actor controller --tool 'actual capture tool'
```

Both accept `--help`. On Windows, use absolute system paths and quote paths containing spaces. The `\` continuation is for POSIX shells; in PowerShell, put the command on one line.

The [validation contract](../references/browser-validation.md) is the complete reference for flags, limits, provenance, keyboard, and states.

## Preserved content and evidence

Do not change `vendor/frontend-design/` to bypass a hash failure. Independent verifier pins, license, and provenance must remain coherent. A real update to licensed content requires explicit review of source, license, bytes, and notices.

Do not turn a file check into a UI result. Record revisions, tools, and limitations in [Validation](runtime-validation.md), keeping older observations as history.

The ZIP supports `node scripts/install.mjs --help` and local installation without Git; packaging tests exercise the extracted installer. The npm entrypoint uses the same runner. Neither proves editor discovery. Validate conversations using the [manual pilot](cursor-smoke-test.md) and [per-run record](../templates/cursor-validation.md) in the disposable project.
