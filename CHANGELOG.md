# Changelog

[Português (Brasil)](CHANGELOG.pt-BR.md)

## 0.1.0 — Alty migration, publication pending

- New canonical home: `alty-oss/dev-design`, with a fresh repository history.
- Public `dev-design` npm package and executable for simple `npx dev-design` installation.
- Shared installer interface for npm and ZIP, with read-only diagnosis, dry run, replacement, backup, and restoration.
- Verified ZIP + SHA-256 distribution retained alongside the npm package.
- English canonical documentation with Brazilian Portuguese counterparts.
- npm trusted publishing preparation for subsequent tagged releases. Published availability and remote checks require their own observed evidence.

## Pre-migration history — 0.2.0 candidate, unpublished

These records describe earlier work before the Alty version reset; their version numbers and observations do not establish a release in the new repository.

- Local installer included in the package: installation, read-only check, dry run, and replacement with backup/restoration.
- Distributed-file validation before installation, protecting against overlapping paths, case aliases, and symlinks.
- Quick start separated from manual installation of the historical 0.1.0 release.
- S01–S09 script, per-run template, and diagnosis of automation, capture, and authentication blockers.
- Resume examples preserving historical evidence and keeping current checks pending until observed again.
- CI matrix executed with Node.js 22/24 on Linux, macOS, and Windows, including ZIP installation, update, and rollback through PowerShell on Windows.
- Test setup corrected for temporary paths with native Windows aliases without weakening restoration checks.
- Review contract strengthened to query Git from the changed project's root and record commit/hashes; retested in Cursor with historical records preserved.

## Pre-migration history — 0.1.0, 2026-10-17

Consolidated **Dev Design v0.1** distribution, with the latest code and documentation at that time.

- Nine UI/UX skills and one routing rule for Cursor.
- Local static-preview and PNG/JPEG metadata-recording helpers.
- README and installation, usage, architecture, development, release, and troubleshooting guides.
- Contributor and agent guidance, with complete guide navigation in the ZIP.
- Identity, internal-link, version, and preserved-content integrity checks.
- ZIP download with SHA-256 checksum and automated GitHub validation.
- Historical public repository identifier omitted during migration; plugin identifier `design` and `/design` entrypoint preserved.
