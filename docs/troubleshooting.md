# Troubleshooting

[Português (Brasil)](pt-BR/troubleshooting.md)

[Documentation](README.md) · [Installation](installation.md) · [Validation](runtime-validation.md)

## The plugin does not appear

Check for `.cursor-plugin/plugin.json` under `~/.cursor/plugins/local/design/`. Common mistakes include omitting the hidden folder or adding an extra level such as `plugins/local/design/design/`.

Reload the window and inspect **Customize**. If your organization blocks local imports, an administrator controls that setting; do not bypass the policy. Official discovery steps are in [Cursor documentation](https://cursor.com/docs/plugins).

## `/design` loads another skill

Check the source shown by Cursor. Another installation with identifier `design`, particularly a marketplace installation, may take precedence. Keep backups outside `plugins/local` and select the intended source. Do not automatically delete third-party plugins to resolve a conflict.

## Checksum or verifier failure

- **Checksum mismatch:** download ZIP and checksum again from the same release; do not mix versions.
- **Version mismatch:** replace the whole installation without merging files.
- **Third-party or policy integrity:** restore the official copy. Do not edit pins to accept unknown bytes.
- **Broken reference:** check that the whole folder was extracted/copied, including documents.
- **Modified clone:** use a clean copy of the intended tag. The repository pins LF to preserve text bytes.

Include the exact error and version when reporting. Do not attach credentials, personal data, or private code.

## npm/npx installation fails

Confirm Node.js 22.14.0+ and npm/npx are available. Confirm `dev-design` and the requested version have actually been published; a migration candidate alone does not make the command available. Distinguish npm registry/login/network failures from installer errors. The verified ZIP route remains available once its release exists. Inspect `--check` before choosing `--replace`.

## The preview does not open

Prefer the project's documented command. The plugin helper only serves static files; it does not compile an application. Supply an existing root and use the process's printed `127.0.0.1` URL. Keep the process running during review.

Hidden files, paths outside the root, and external symlinks are rejected. Do not expand the root to include private files just to bypass a refusal. See [Development](development.md#local-helpers) for commands.

## No captures or keyboard input does not work

Record the pending check and observed reason. For wrong dimensions or repeated image regions, follow the [validation contract](../references/browser-validation.md) retry budget. Do not crop/edit images to make a result appear valid.

The metadata recorder does not produce screenshots. A synthetic keyboard event or successful tool call without observed focus changes does not prove native navigation.

## Packaging is rejected

Use a source clone with Git and unzip. An installed ZIP is for plugin use and contains neither tests nor the release builder. Commit reviewed changes before packaging; check version, intended tag, and file list.

See [Releases](releasing.md). Follow [Contributing](../CONTRIBUTING.md) to report reproducible problems.

## Installer failure

- **Missing/old Node:** check `node --version`, install Node.js 22.14.0+ through your system's procedure, and retry.
- **Different destination:** inspect `--check`, including extra files. Use `--replace` only when choosing to replace that copy; keep the returned backup path.
- **Permission denied:** inspect access to the error's source/destination. Correct the identified permission before retrying; do not default to elevated privileges.
- **Overlap/symlink:** keep source outside destination and use canonical paths without symlink ancestors. Do not bypass rejection by editing the installer.
- **Installed but Customize shows another source:** inspect the `/design` conflict above. Disk success does not confirm the loaded copy.

## Reproduce environment blockers

The [Cursor pilot](cursor-smoke-test.md) defines AMB-01–AMB-04 and retests. Reproduce historical errors in the current version before assigning a cause. Refresh interface observations after each change; old IDs cannot guide the next action. For capture, record the exact error and investigate documented tool requirements before changing permissions or restarting components. A successful alternative capture does not close the original problem.

### Intermittent native capture and unavailable window

In the macOS pilot, renewing the automation session and activating the window through the documented tool mechanism recovered typing. Activating the window before capture also produced real images, but `-3811` returned after another conversation switch. This was an observed recovery, not a permanent cause/fix.

1. Check the current application/window title. If the target is invalid, renew session/selection through the documented mechanism.
2. Activate the intended window, obtain a fresh observation, and use only its IDs.
3. After entering a prompt, inspect the actual text before sending. Do not insert it again if the action already occurred despite an observation error.
4. Capture the active window and inspect image/dimensions. A whole-window image does not prove a product viewport capture.
5. If the bounded retest still fails, preserve reproduction and keep affected checks pending. Continue only observable capabilities.

Apple describes [`internalError`](https://developer.apple.com/documentation/screencapturekit/scstreamerror/internalerror) as an internal stream-start failure; the code alone does not identify its cause. [Public reports involving inactive windows and Stage Manager](https://github.com/openai/codex/issues/38348) provide investigation hypotheses. They do not prove this environment's cause or justify automatically changing permissions/preferences.

CLI is optional. Check `cursor-agent --version` and `cursor-agent status`; if authentication is needed, the account holder completes the documented flow. Do not record tokens/cookies. A CLI response does not prove discovery in Customize.
