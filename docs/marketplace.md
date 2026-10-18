# Cursor marketplace preparation

[Português (Brasil)](pt-BR/marketplace.md)

[Documentation](README.md) · [Releases](releasing.md) · [Validation](runtime-validation.md)

Status: local preparation of Alty candidate `0.1.0`. This document does not record submission, approval, or a public marketplace listing.

## Package data

| Field | Prepared value |
| --- | --- |
| Presentation | Dev Design |
| Plugin identifier | `design` |
| npm package | `dev-design` |
| Candidate version | `0.1.0` |
| Repository | [alty-oss/dev-design](https://github.com/alty-oss/dev-design) |
| Description | UI/UX workflow to create, improve, and review interfaces in Cursor using the project's stack and identity. |
| Components | Nine skills and `design-router` rule. |
| Entry | `/design` |
| License | Apache-2.0, with [third-party notices](../THIRD_PARTY_NOTICES.md). |
| Runtime requirements | Node.js 22.14.0+ for installer/helpers; no npm dependencies, required MCP, or external services. |
| Alternative distribution | npm/npx and ZIP with checksum and local installer. |

## Submission checklist

- [ ] Identify the candidate commit and attach test, integrity, and extracted-ZIP results.
- [ ] Check diagnosis and installation from the candidate ZIP and npm tarball.
- [ ] Record S01–S06 and S09 in the editor; distinguish browser/keyboard outcomes and limitations for S07–S08.
- [ ] Check name/source to avoid confusion with another `design` installation; record conflicts without automatically renaming interfaces.
- [ ] Review metadata and current requirements in the [official plugin reference](https://cursor.com/docs/reference/plugins).
- [ ] With submission authorization, use the channel in [plugin documentation](https://cursor.com/docs/plugins) and record date/status/feedback.
- [ ] After approval, check listing installation in Customize and the source of `/design`.
- [ ] Only then add the verified listing link to quick start and record approval in the changelog.

CLI observations do not establish editor discovery. External capture or automation errors remain open until retested, as described in [Validation](runtime-validation.md). Local documents and the candidate package can be prepared before external approval.
