# Publishing a version

[Português (Brasil)](pt-BR/releasing.md)

[Documentation](README.md) · [Development](development.md) · [Validation](runtime-validation.md)

This guide is for maintainers of `alty-oss/dev-design`. The npm package/executable is `dev-design`; the plugin remains `design`. Verifiable assets remain `design-<version>.zip` and `design-<version>.zip.sha256`.

## Prepare

1. Set the same SemVer in `package.json` and `.cursor-plugin/plugin.json`.
2. Update both changelog locales, release notes, download/installation examples, and validation records. Preserve old results as history.
3. Confirm the ZIP and npm allowlists contain every required file and no machine-specific files, credentials, tests, or workflows.
4. Run `npm test`, `npm run verify`, and `npm pack --dry-run --json`; review the exact npm contents.
5. Review the diff and commit. ZIP packaging requires a clean tree, including no unignored new files.

Repository and manifest metadata must point to `https://github.com/alty-oss/dev-design`. Third-party content and notices accompany both distributions. English/Portuguese navigation must resolve in extracted packages.

## Build and inspect locally

With Git, unzip, and Node.js 22.14.0 or newer:

```sh
node scripts/package.mjs --output ../dev-design-artifacts --tag v0.1.0
npm pack --dry-run --json
```

The ZIP command uses `git archive` on the current commit, with root `design/` and an explicit allowlist. It extracts the ZIP, checks the list, runs the verifier, and compares bytes with the source before writing ZIP and checksum. `--tag` must match the version; it validates the intended name without creating a tag.

Inspect a real `npm pack` tarball and run its CLI with a disposable home/cache before publication. The npm executable and `node scripts/install.mjs` must share behavior. A dirty tree, version mismatch, missing file, unsafe entry, broken link, or hash mismatch must be fixed in source. Never edit the ZIP/checksum to conceal a failure.

## Bootstrap npm and configure trusted publishing

The first public npm release requires an authorized npm maintainer and the account's 2FA/login flow. Confirm the package name is available to that account before publishing the reviewed tarball as public `dev-design@0.1.0`.

After the first publish, configure a GitHub trusted publisher for npm package `dev-design`, repository owner `alty-oss`, repository `dev-design`, and workflow `release.yml`. With a CLI supporting the command:

```sh
npm trust github dev-design --repo alty-oss/dev-design --file release.yml --allow-publish
```

Use the npm package settings if interactive setup is required. Require 2FA/OIDC publication as supported by the account and package settings; do not add an npm token to the repository. Trusted publishing relies on GitHub OIDC and a GitHub-hosted runner, with `id-token: write`. Follow [npm trusted-publisher guidance](https://docs.npmjs.com/trusted-publishers/) for current CLI/runtime requirements. Verify the publisher configuration and package provenance after the first automated publish; until observed, record them as pending.

## Publish on GitHub and npm

Push `main` and inspect **Checks** first, then create/push the approved version tag:

```sh
git push origin main
git tag -a v0.1.0 -m 'Dev Design 0.1.0'
git push origin v0.1.0
```

The **Release** workflow uses GitHub-hosted Node.js 24, runs tests, verification, and packaging, and publishes publicly to npm through trusted publishing only when that exact package version is absent. A registry/authentication failure is an error, not evidence that the version is missing. The bootstrap version may already exist; the workflow must still produce its GitHub ZIP/checksum.

The title uses major/minor when patch is zero: `v0.1.0` produces **Dev Design v0.1**, retaining `0.1.0` in metadata and ZIP filenames. The job needs `contents: write` for GitHub assets and `id-token: write` for npm OIDC. Inspect [Actions](https://github.com/alty-oss/dev-design/actions), [Releases](https://github.com/alty-oss/dev-design/releases), and npm for the actual outcome. GitHub/npm publication does not submit the plugin to Cursor's marketplace.

## Validate public downloads

1. Download ZIP and checksum from the same release without authentication.
2. Check SHA-256 using the [installation procedure](installation.md).
3. Extract into an empty directory and run `node scripts/verify.mjs` from `design`.
4. Compare the extracted list and bytes with the published source version.
5. Inspect npm metadata, package version, tarball contents, and provenance. In a disposable home, run the published pinned command and `--check`.
6. In a test installation, confirm Cursor discovery and execution. Unavailable checks remain pending.

ZIP compression may vary across tool versions. Its checksum proves the specific downloaded artifact; extracted-file comparison proves its content.

## Failures and previous versions

Read the first failed workflow step. Before any publication/tag push, fix the working commit and retry. Once a public version exists, ship corrections as a new version; do not silently replace public assets or move tags.

After a partial release, inspect the real state and complete verified same-version assets without overwriting an existing public asset. npm versions are immutable; an existing version must not be republished. For product problems, offer the previous version and publish a fix with a changelog note.

## Repository migration gate

Export reviewed tracked project files into a fresh `main` history for `alty-oss/dev-design`, excluding the former `.git` directory and private/ignored artifacts. Do not attribute pre-migration CI runs or releases to the new repository. Delete the former personal repository only after the Alty repository, public npm package, ZIP/checksum release, and installation checks have all succeeded and been recorded.
