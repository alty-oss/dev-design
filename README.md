# Dev Design

[Português (Brasil)](README.pt-BR.md)

A UI/UX workflow for Cursor: turn an interface request into clear decisions, consistent components, and a reviewed implementation.

[![Checks](https://github.com/alty-oss/dev-design/actions/workflows/ci.yml/badge.svg)](https://github.com/alty-oss/dev-design/actions/workflows/ci.yml)

[Install](docs/installation.md) · [Usage](docs/usage.md) · [Documentation](docs/README.md) · [Contribute](CONTRIBUTING.md) · [Downloads](https://github.com/alty-oss/dev-design/releases)

## What you can do

- Build screens from a brief, with visual direction, flows, and states defined.
- Improve existing interfaces while preserving the project's tokens, components, and identity.
- Review responsive behavior, interaction, and accessibility with evidence from the checks actually performed.
- Deliver decisions, limitations, and next steps in files inside your project.

The workflow combines **nine skills** and a routing rule. Small changes use only the necessary stages; tasks unrelated to interfaces proceed normally.

## Quick start

Once the npm package is published, install with Node.js **22.14.0 or newer**:

```sh
npx dev-design
```

For a fixed version, use `npx dev-design@0.1.0`. Run `npx dev-design --check` for a read-only diagnosis; review differences before using `--replace` to update with a backup.

The independently verifiable route remains a ZIP and SHA-256 checksum from the same [release](https://github.com/alty-oss/dev-design/releases). Verify the checksum, extract the `design` directory, and run:

```sh
node scripts/install.mjs
```

The current migration prepares version **0.1.0** for the Alty repository. Package, tag, and release availability must be confirmed before using a published command or download; older validation records describe the pre-migration project.

Then run **Developer: Reload Window**, open **Customize**, check the plugin's source, nine skills, and `design-router`, and select `/design` in your project:

> /design Fix only this button's alignment. Preserve the current typography, colors, and behavior. Record what you were able to verify.

**Requirements:** Cursor with local plugins allowed; Node.js **22.14.0 or newer** for installation and helpers. There are no npm dependencies to install. Folder integrity, editor discovery, and execution of `/design` are separate confirmations. See [Installation](docs/installation.md) for npm, ZIP, clone, update, and rollback.

## How it works

Brief → visual direction → interactions and states → tokens and components → implementation → review → handoff.

The agent uses the existing stack and records context in `docs/design/<slug>/` **inside your project**. The [workflow guide](docs/usage.md) explains when each skill applies and which files it produces.

| Name | Where it appears |
| --- | --- |
| **Dev Design** | Project presentation |
| `dev-design` | GitHub repository, npm package, and terminal command |
| `design` | Plugin identifier, installed folder, and `/design` skill |

## Documentation

| You want to… | Read |
| --- | --- |
| Install, update, or remove | [Installation](docs/installation.md) |
| Choose a workflow and write a request | [Usage](docs/usage.md) |
| Resolve discovery or tool problems | [Troubleshooting](docs/troubleshooting.md) |
| Understand the plugin's structure and limits | [Architecture](docs/architecture.md) |
| Change and test the code | [Development](docs/development.md) |
| Build and publish a version | [Releases](docs/releasing.md) |
| Check current evidence and limitations | [Validation](docs/runtime-validation.md) |

English is the canonical documentation language; every maintained guide has a Brazilian Portuguese counterpart.

## Project status

The project is evolving. Code, integrity, and distribution checks are automated. Some editor discovery and workflow checks remain pending, as documented in [Validation](docs/runtime-validation.md). Results depend on the model and available tools; the workflow does not certify complete accessibility conformance.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md). Agents working on the code should start with [AGENTS.md](AGENTS.md).

Distributed under [Apache-2.0](LICENSE), with preserved [third-party notices](THIRD_PARTY_NOTICES.md) and provenance records. See the [changelog](CHANGELOG.md) for changes by version.
