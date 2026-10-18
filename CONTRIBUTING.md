# Contributing to Dev Design

[Português (Brasil)](CONTRIBUTING.pt-BR.md)

Thank you for helping improve the workflow, examples, and documentation.

## Report a problem

Open an [issue](https://github.com/alty-oss/dev-design/issues) with the plugin and Cursor versions, operating system, reproduction steps, expected result, and observed result. For agent-related issues, include the model and available tools. Use a minimal example with fictional data; remove credentials and private information from screenshots and logs.

State when a check could not be performed. Do not present a tool limitation as a confirmed plugin failure without evidence that distinguishes the causes.

## Propose changes

1. Read [Architecture](docs/architecture.md) and [Development](docs/development.md).
2. Create a branch with a focused change. For larger work, describe the problem and proposal in an issue first.
3. Preserve the `design` identifier, skill names, and helper interfaces unless the approved change requires migration.
4. Update the relevant guide and tests for new or corrected behavior.
5. Run `npm test` and `npm run verify` before opening a pull request.

In the pull request, explain the problem, resulting behavior, verification, and remaining limitations. For documentation, review links, commands, and file availability in the ZIP and npm package.

## Conventions

- Public name: **Dev Design**. Repository, npm package, and CLI: **dev-design**. Plugin and editor command: **design**.
- English is canonical. Maintain Brazilian Portuguese mirrors, reciprocal language links, and locale-appropriate navigation for every maintained document, reference, template, and skill.
- User guides belong in `docs/`; skill contracts belong in `references/` and `templates/`.
- Use native Node.js features and retain the Node.js 22.14.0 minimum. A new dependency requires justification in the proposal.
- Preserve licenses, attribution, and third-party bytes. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Record real evidence; do not claim visual, keyboard, or accessibility tests that were not observed.

## Releases

Maintainers follow [Publishing a version](docs/releasing.md). Fixes to a public version ship as a new version, preserving previous tags.
