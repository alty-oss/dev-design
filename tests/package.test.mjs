import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, cpSync, rmSync, readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const source = dirname(dirname(fileURLToPath(import.meta.url)));
const version = JSON.parse(readFileSync(join(source, "package.json"), "utf8")).version;
function fixture(run) {
  const temp = realpathSync(mkdtempSync(join(tmpdir(), 'design-release-test-')));
  const root = join(temp, 'repo');
  cpSync(source, root, { recursive: true, filter: p => !p.split(/[\\/]/).some(n => ['.git', 'node_modules', 'coverage', 'artifacts', 'dist'].includes(n)) });
  const git = args => execFileSync('git', args, { cwd: root, stdio: 'pipe' });
  git(['init', '-b', 'main']);
  writeFileSync(join(root, 'private-research.txt'), 'Not part of the runtime distribution.\n');
  git(['add', '.']);
  git(['-c', 'user.name=Release Test', '-c', 'user.email=release-test@example.invalid', 'commit', '-m', 'Prepared snapshot']);
  const output = join(temp, 'output');
  const build = (...args) => spawnSync(process.execPath, ['scripts/package.mjs', '--output', output, ...args], { cwd: root, encoding: 'utf8' });
  try { run({ root, output, build, git }); } finally { rmSync(temp, { recursive: true, force: true }); }
}

test('release ZIP contains exactly the public runtime list and verifies after extraction', () => fixture(({ root, output, build }) => {
  const result = build('--tag', `v${version}`);
  assert.equal(result.status, 0, result.stderr);
  const archive = join(output, `design-${version}.zip`);
  const names = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).trim().split('\n').filter(n => !n.endsWith('/')).sort();
  const files = JSON.parse(readFileSync(join(root, 'scripts/release-files.json'), 'utf8'));
  assert.deepEqual(names, files.map(n => 'design/' + n).sort());
  assert.ok(names.includes('design/.cursor-plugin/plugin.json'));
  for (const doc of ['README.md', 'AGENTS.md', 'CONTRIBUTING.md', 'docs/README.md', 'docs/installation.md', 'docs/usage.md', 'docs/architecture.md', 'docs/development.md', 'docs/releasing.md', 'docs/troubleshooting.md']) {
    assert.ok(names.includes('design/' + doc), 'Missing distributed documentation: ' + doc);
  }
  assert.ok(!names.some(n => /private-research|tests\/|\.github\/|\.git\//.test(n)));
  const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
  assert.equal(readFileSync(archive + '.sha256', 'utf8'), `${digest}  design-${version}.zip\n`);
  const extracted = join(output, 'extracted');
  execFileSync('unzip', ['-q', archive, '-d', extracted]);
  const check = spawnSync(process.execPath, ['scripts/verify.mjs'], { cwd: join(extracted, 'design'), encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /package OK/);
  const extractedRoot = join(extracted, 'design');
  const help = spawnSync(process.execPath, ['scripts/install.mjs', '--help'], { cwd: extractedRoot, encoding: 'utf8' });
  assert.equal(help.status, 0, help.stderr);
  for (const flag of ['--help', '--check', '--dry-run', '--replace']) assert.ok(help.stdout.includes(flag));
  const destination = join(output, 'isolated-home/.cursor/plugins/local/design');
  const install = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { installPlugin } from './scripts/install.mjs';
    import { verify } from './scripts/verify.mjs';
    const targetRoot = process.argv[1];
    const result = installPlugin({ sourceRoot: process.cwd(), targetRoot });
    if (result.status !== 'installed') throw Error('Expected fresh installation');
    verify(targetRoot);
  `, destination], { cwd: extractedRoot, encoding: 'utf8' });
  assert.equal(install.status, 0, install.stderr);
}));

test('npm tarball contains only the verified runtime and package binary', () => fixture(({ root }) => {
  const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' }));
  const actual = packed[0].files.map(file => file.path).sort();
  const releaseFiles = JSON.parse(readFileSync(join(root, 'scripts/release-files.json'), 'utf8'));
  const expected = [...new Set([...releaseFiles, 'bin/dev-design.mjs', 'package.json'])].sort();
  assert.deepEqual(actual, expected);
  assert.equal(packed[0].name, 'dev-design');
}));

test('packed npm binary installs from an isolated home', () => fixture(({ root, output }) => {
  const packed = JSON.parse(execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' }));
  const archive = join(root, packed[0].filename);
  const home = join(output, 'npx-home');
  mkdirSync(home, { recursive: true });
  const run = spawnSync('npm', ['exec', '--yes', `--package=${archive}`, '--', 'dev-design', '--check'], {
    cwd: root,
    env: { ...process.env, HOME: home, USERPROFILE: home },
    encoding: 'utf8'
  });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).status, 'missing');
  assert.equal(spawnSync('npm', ['exec', '--yes', `--package=${archive}`, '--', 'dev-design'], {
    cwd: root,
    env: { ...process.env, HOME: home, USERPROFILE: home },
    encoding: 'utf8'
  }).status, 0);
  assert.ok(existsSync(join(home, '.cursor/plugins/local/design/.cursor-plugin/plugin.json')));
}));

test('release builder rejects a tag that differs from the package version', () => fixture(({ output, build }) => {
  const result = build('--tag', 'v9.0.0');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /tag.*version/i);
  assert.equal(existsSync(join(output, `design-${version}.zip`)), false);
}));

test('release builder rejects dirty sources instead of archiving stale committed bytes', () => fixture(({ root, build }) => {
  writeFileSync(join(root, 'README.md'), 'Changed after commit.\n');
  const result = build();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /clean|dirty/i);
}));

test('release builder rejects missing or unsafe allowlist entries', () => {
  for (const entry of ['../outside.txt', 'README.md\nother', 'missing-file.txt', 'skills']) fixture(({ root, build, git }) => {
    const p = join(root, 'scripts/release-files.json');
    const list = JSON.parse(readFileSync(p, 'utf8')); list.push(entry);
    writeFileSync(p, JSON.stringify(list));
    git(['add', '.']);
    git(['-c', 'user.name=Release Test', '-c', 'user.email=release-test@example.invalid', 'commit', '-m', 'Invalid distribution list']);
    const result = build();
    assert.notEqual(result.status, 0, entry);
    assert.match(result.stderr, /allowlist|distribution|release file/i);
  });
});
