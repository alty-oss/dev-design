# Installation

[Português (Brasil)](pt-BR/installation.md)

[Documentation](README.md) · [Usage](usage.md) · [Troubleshooting](troubleshooting.md)

## Requirements and names

- Cursor supporting local plugins, with local imports allowed by your organization's settings.
- Node.js **22.14.0 or newer** for installation, preview, capture recording, and source checks. Cursor instruction discovery is separate.
- npm/npx for npm installation; Git only if you choose the clone route.

The repository, npm package, and executable are **dev-design**. The plugin identifier and installed folder remain **design**:

```text
~/.cursor/plugins/local/design/
  .cursor-plugin/plugin.json
  skills/
  rules/
  references/
  scripts/
```

The migration prepares Alty version `0.1.0`; confirm publication on npm or [Releases](https://github.com/alty-oss/dev-design/releases) before using a published command/download. Pre-migration validation does not establish availability in the new repository.

## Recommended route — npm/npx

```sh
npx dev-design
```

Pin a version for repeatability with `npx dev-design@0.1.0`. npm obtains the package and runs its `dev-design` executable. The shared installer validates the source and copies only approved distribution files to `~/.cursor/plugins/local/design`.

| npm command | Effect |
| --- | --- |
| `npx dev-design --help` | Show the interface. |
| `npx dev-design --check` | Read-only diagnosis. |
| `npx dev-design --dry-run` | Read-only inspection and next steps. |
| `npx dev-design` | Install if absent; recognize an identical copy. |
| `npx dev-design --replace` | Replace a different destination after a complete backup. |

Then reload Cursor and perform the Customize confirmation below. The installer does not open a browser or restart the editor.

## Verifiable route — ZIP + SHA-256

Download `design-0.1.0.zip` and `design-0.1.0.zip.sha256` from the same [release](https://github.com/alty-oss/dev-design/releases). Use the exact downloaded filenames and verify before extracting or installing. Folder verification does not replace the ZIP checksum.

### macOS and Linux

From the download directory:

```sh
# macOS
shasum -a 256 -c design-0.1.0.zip.sha256
# Linux
sha256sum -c design-0.1.0.zip.sha256
```

After a valid result, extract into an empty directory outside `plugins/local`, enter the extracted `design` directory, and install:

```sh
unzip design-0.1.0.zip -d dev-design-download
cd dev-design-download/design
node scripts/install.mjs
```

### Windows — PowerShell

```powershell
$expected = ((Get-Content .\design-0.1.0.zip.sha256).Trim() -split '\s+')[0]
$actual = (Get-FileHash .\design-0.1.0.zip -Algorithm SHA256).Hash
if ($actual -ine $expected) { throw 'Checksum mismatch. Download the file again.' }
Expand-Archive .\design-0.1.0.zip -DestinationPath .\dev-design-download
Set-Location .\dev-design-download\design
node scripts/install.mjs
```

The extracted source accepts the same options: `node scripts/install.mjs --help`, `--check`, `--dry-run`, and `--replace`. Both CLI routes emit JSON, with nonzero exit codes for errors. Diagnosis reports `status` (`missing`, `matching`, `different`, or `invalid`), versions, relative-path `differences`, and `nextSteps`. Installation reports `installed`, `updated`, or `already-installed`, the version, and `backupPath` (null without a backup). Extra destination files count as differences; without `--replace`, the destination is preserved.

Backups use `~/.cursor/plugins-backups/<unique-name>/design`, outside discovered plugin copies; staging uses `~/.cursor/plugins-staging/`. Overlapping source/destination paths, symlinks, and symlink ancestors are rejected. If the source was opened through an alias, use its actual canonical path; do not disable protection.

### Manual copy alternative

After checksum verification, check whether the destination already exists. Save an entire previous installation **outside `plugins/local`** and move it out of that directory. Copy the whole extracted `design` folder, including hidden `.cursor-plugin`, into `~/.cursor/plugins/local/design`. Never merge versions. If the checksum fails, download both files again from the same release.

## Alternative — version-pinned clone

The destination must be free. After confirming the tag exists, pin it for reproducibility and rollback.

macOS/Linux:

```sh
mkdir -p "$HOME/.cursor/plugins/local"
git clone --branch v0.1.0 --depth 1 https://github.com/alty-oss/dev-design.git "$HOME/.cursor/plugins/local/design"
```

PowerShell:

```powershell
$pluginRoot = Join-Path $HOME '.cursor\plugins\local'
New-Item -ItemType Directory -Force $pluginRoot | Out-Null
git clone --branch v0.1.0 --depth 1 https://github.com/alty-oss/dev-design.git (Join-Path $pluginRoot 'design')
```

Git may report `detached HEAD` when using a tag; this is expected for a pinned installation. The repository's line-ending rules preserve bytes required for integrity checks.

## Activate and confirm

1. Restart Cursor or run **Developer: Reload Window**.
2. Open **Customize** and locate plugin `design`.
3. Check the nine skills and `design-router` rule.
4. In a project, find `/design` and confirm the skill's source before selecting it.

Local discovery follows [Cursor documentation](https://cursor.com/docs/plugins). A marketplace installation with the same identifier may take precedence. Symlinks targeting outside `plugins/local` are not a substitute for a complete copy.

If the plugin does not appear, follow [Troubleshooting](troubleshooting.md). Disk confirmation does not prove editor discovery.

## Update, roll back, and remove

For npm, inspect `npx dev-design@<version> --check` and use `npx dev-design@<version> --replace` for the chosen published version. For ZIP, download the desired version, verify its checksum, and extract outside the installation. Run `node scripts/install.mjs --check` from the new source, review differences, then use `--replace`. Keep the returned `backupPath`. A failure attempts to restore the previous copy; read the error and inspect the destination before retrying.

For manual installation, verify the new checksum, save the old installation outside `plugins/local`, replace the entire folder, and reload. For clones, use the desired tag.

To roll back, use the exact returned backup path: move the current copy out of `plugins/local`, restore the complete backup, and reload. Do not edit one version's files to pass another version's verifier.

To remove, move `~/.cursor/plugins/local/design` outside `plugins/local` and reload Cursor. Your projects' `docs/design/` artifacts remain available.
