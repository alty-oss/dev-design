import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, lstatSync, readdirSync, renameSync } from 'node:fs';
import { resolve, dirname, join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { verify } from './verify.mjs';

// Archive only explicit runtime files from an immutable, clean Git commit.
export function buildRelease(root, output, tag) {
  root = resolve(root); output = resolve(output);
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (git(['status', '--porcelain', '--untracked-files=normal'])) throw new Error('Release requires a clean working tree');
  const commit = git(['rev-parse', 'HEAD']);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (tag !== undefined && tag !== `v${pkg.version}`) throw new Error('Release tag must match package version');
  const files = JSON.parse(readFileSync(join(root, 'scripts/release-files.json'), 'utf8'));
  if (!Array.isArray(files) || !files.length || new Set(files).size !== files.length) throw new Error('Invalid release allowlist');
  for (const file of files) {
    if (typeof file !== 'string' || !/^[a-zA-Z0-9._/-]+$/.test(file) || file.startsWith('/') || file.split('/').some(p => !p || p === '.' || p === '..' || p === '.git')) throw new Error('Unsafe release allowlist entry');
    let path = root;
    try {
      for (const part of file.split('/')) {
        path = join(path, part);
        if (lstatSync(path).isSymbolicLink()) throw new Error('symlink');
      }
      if (!lstatSync(path).isFile()) throw new Error('not a file');
    } catch { throw new Error('Invalid release file: ' + file); }
  }
  verify(root);
  const temp = mkdtempSync(join(tmpdir(), 'design-release-'));
  const name = `design-${pkg.version}.zip`;
  try {
    const archive = join(temp, name);
    git(['archive', '--format=zip', '--prefix=design/', `--output=${archive}`, commit, '--', ...files]);
    const extraction = join(temp, 'extracted');
    execFileSync('unzip', ['-q', archive, '-d', extraction], { stdio: 'pipe' });
    const extractedRoot = join(extraction, 'design');
    const actual = [];
    function walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.isFile()) actual.push(relative(extractedRoot, path).split(sep).join('/'));
        else throw new Error('Unexpected distribution entry');
      }
    }
    walk(extractedRoot);
    if (JSON.stringify(actual.sort()) !== JSON.stringify([...files].sort())) throw new Error('Distribution differs from release allowlist');
    verify(extractedRoot);
    for (const file of files) {
      if (!readFileSync(join(root, file)).equals(readFileSync(join(extractedRoot, file)))) throw new Error('Distribution bytes mismatch: ' + file);
    }
    const bytes = readFileSync(archive);
    const digest = createHash('sha256').update(bytes).digest('hex');
    mkdirSync(output, { recursive: true });
    // Publish files only after the extracted archive passed every check.
    const destination = join(output, name);
    writeFileSync(destination + '.tmp', bytes);
    renameSync(destination + '.tmp', destination);
    writeFileSync(destination + '.sha256', `${digest}  ${name}\n`);
    return { archive: destination, sha256: digest, commit, files: files.length };
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    let output; let tag;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--output' && args[i + 1]) output = args[++i];
      else if (args[i] === '--tag' && args[i + 1]) tag = args[++i];
      else throw new Error('Usage: node scripts/package.mjs --output DIRECTORY [--tag vVERSION]');
    }
    if (!output) throw new Error('--output is required');
    console.log(JSON.stringify(buildRelease(resolve(dirname(fileURLToPath(import.meta.url)), '..'), output, tag)));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
