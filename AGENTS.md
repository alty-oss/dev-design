# Guide for agents and contributors

[Português (Brasil)](AGENTS.pt-BR.md)

Dev Design is a UI/UX workflow plugin for Cursor, maintained at `alty-oss/dev-design`. The npm package is `dev-design`; the plugin identifier remains `design`. `/design` and the nine skill names are existing interfaces.

## Start here

| Document | Purpose |
| --- | --- |
| [README](README.md) | Introduction and quick start |
| [Index](docs/README.md) | Guide navigation |
| [Architecture](docs/architecture.md) | Components and boundaries |
| [Development](docs/development.md) | Environment, commands, and tests |
| [Contributing](CONTRIBUTING.md) | Conventions and proposals |
| [Validation](docs/runtime-validation.md) | Observed evidence and pending checks |

## Working on the code

- Respect the user's instructions and scope. Do not turn a documentation change into a workflow redesign.
- Use Node.js 22.14.0 or newer and the existing native APIs; there are no npm dependencies to install.
- Preserve skill and helper interfaces unless the approved task requires a change.
- Keep versions in `package.json` and `.cursor-plugin/plugin.json` consistent and metadata pointing to the canonical repository.
- Preserve the bytes in `vendor/frontend-design/`, licenses, notices, and provenance. Do not change hashes to bypass failures.
- Keep machine paths, backups, research, and credentials out of the distribution.
- When adding a document used by the guides, check links and `scripts/release-files.json` so navigation also works in the ZIP.
- Write plans in `docs/plans/`, separate from user guides. Record only observed evidence; unavailable checks remain pending.
- Maintain English canonical documentation and matching `pt-BR` translations with reciprocal language links. Preserve legal and vendored source material unchanged.

## Verify and deliver

```sh
npm test
npm run verify
```

To build a distribution, follow [Releases](docs/releasing.md) on a clean commit. Report the outcome, checks performed, and limitations. Artifacts the plugin produces for a user's task belong in that user's project, under `docs/design/<slug>/`, not in the plugin installation.
