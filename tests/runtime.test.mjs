import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, symlink, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { request } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
const preview = await import('../scripts/preview.mjs').catch(() => ({}));
const capture = await import('../scripts/record-capture.mjs').catch(() => ({}));
function start(...args) { assert.equal(typeof preview.startPreview, 'function', 'startPreview export is missing'); return preview.startPreview(...args); }
function record(...args) { assert.equal(typeof capture.recordCapture, 'function', 'recordCapture export is missing'); return capture.recordCapture(...args); }
async function fixture(t) {
  const temp = await mkdtemp(join(tmpdir(), 'design-runtime-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const rootPath = join(temp, 'project with spaces'); await mkdir(rootPath);
  const root = await realpath(rootPath);
  await writeFile(join(root, 'index.html'), '<h1>Actual project</h1>');
  await writeFile(join(root, 'style.css'), 'body { color: red }');
  return { root, temp };
}
function http(url, path = '/', method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request(new URL(url), { path, method, agent: false }, res => {
      const data = []; res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data).toString() }));
    }); req.on('error', reject); req.end();
  });
}
function crc32(data) { let c = 0xffffffff; for (const b of data) { c ^= b; for (let n = 0; n < 8; n++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); } return (c ^ 0xffffffff) >>> 0; }
function png(width, height) {
  const chunk = (type, data) => { const name = Buffer.from(type); const length = Buffer.alloc(4); length.writeUInt32BE(data.length); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([name, data]))); return Buffer.concat([length, name, data, crc]); };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(Buffer.alloc(height * (1 + width * 4)))), chunk('IEND', Buffer.alloc(0))]);
}
// Portable 3x2 neutral image, encoded once by macOS sips from a synthetic PNG.
// Tests consume these original JPEG bytes; no image utility/dependency is needed at runtime.
const jpeg = Buffer.from('/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAA6ADAAQAAAABAAAAAgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAgADAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8AKKKKAP/Z', 'base64');
const options = root => ({ root, file: 'capture.png', revision: 'sha256:actual-source-hash', route: '/', state: 'idle', viewport: { width: 12, height: 8 }, kind: 'viewport', actor: 'controller', tool: 'documented screenshot API' });

test('preview serves explicit root on loopback and reports chosen ephemeral port', async t => {
  const { root } = await fixture(t); const server = await start(root); t.after(() => server.close());
  assert.equal(server.root, root); assert.equal(server.pid, process.pid);
  const url = new URL(server.url); assert.equal(url.hostname, '127.0.0.1'); assert.ok(Number(url.port) > 0);
  assert.equal(server.server.address().address, '127.0.0.1');
  assert.equal((await http(server.url)).body, '<h1>Actual project</h1>');
  await server.close(); await assert.rejects(http(server.url), /ECONNREFUSED/);
});
test('preview serves CSS, HEAD, directory index and clear HTTP failures', async t => {
  const { root } = await fixture(t); await mkdir(join(root, 'nested')); await writeFile(join(root, 'nested/index.html'), 'Nested');
  const server = await start(root); t.after(() => server.close());
  const css = await http(server.url, '/style.css'); assert.equal(css.status, 200); assert.match(css.headers['content-type'], /text\/css/);
  const head = await http(server.url, '/style.css', 'HEAD'); assert.equal(head.body, ''); assert.equal(Number(head.headers['content-length']), Buffer.byteLength(css.body));
  assert.equal((await http(server.url, '/nested/')).body, 'Nested');
  assert.equal((await http(server.url, '/missing')).status, 404);
  assert.equal((await http(server.url, '/', 'POST')).status, 405);
  assert.equal((await http(server.url, '/%broken')).status, 400);
});
test('preview redirects slashless directories so relative assets resolve at the final document URL', async t => {
  const { root } = await fixture(t);
  await mkdir(join(root, 'nested'));
  await writeFile(join(root, 'nested/index.html'), '<link rel="stylesheet" href="style.css">');
  await writeFile(join(root, 'nested/style.css'), 'body { color: blue }');
  const server = await start(root); t.after(() => server.close());
  const redirect = await http(server.url, '/nested?theme=dark&label=a%20b');
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.location, '/nested/?theme=dark&label=a%20b');
  const document = await fetch(new URL('/nested?theme=dark&label=a%20b', server.url));
  assert.equal(document.status, 200);
  assert.equal(document.url, new URL('/nested/?theme=dark&label=a%20b', server.url).href);
  const html = await document.text();
  const asset = await fetch(new URL(html.match(/href="([^"]+)"/)[1], document.url));
  assert.equal(asset.status, 200); assert.equal(await asset.text(), 'body { color: blue }');
  const head = await http(server.url, '/nested?theme=dark', 'HEAD');
  assert.equal(head.status, 308); assert.equal(head.headers.location, '/nested/?theme=dark'); assert.equal(head.body, '');
});
test('preview directory redirects keep double-slash and encoded names within the same origin', async t => {
  const { root, temp } = await fixture(t);
  for (const name of ['external.example', 'nested space', 'nested#name']) { await mkdir(join(root, name)); await writeFile(join(root, name, 'index.html'), name); }
  await symlink(temp, join(root, 'outside'));
  const server = await start(root); t.after(() => server.close());
  for (const [path, location] of [['//external.example?x=1', '/external.example/?x=1'], ['/%2fexternal.example', '/external.example/'], ['/nested%20space', '/nested%20space/'], ['/nested%23name?q=%2f', '/nested%23name/?q=%2f'], ['/%5c?q=1', '/?q=1']]) {
    const response = await http(server.url, path);
    assert.equal(response.status, 308, path); assert.equal(response.headers.location, location, path);
    const destination = new URL(response.headers.location, server.url);
    assert.equal(destination.origin, new URL(server.url).origin);
    assert.equal((await fetch(destination)).status, 200);
  }
  for (const path of ['/outside', '/.private', '/%2e%2e']) {
    const response = await http(server.url, path); assert.equal(response.status, 403, path); assert.equal(response.headers.location, undefined);
  }
});
test('preview redirects encoded terminal separators before resolving relative assets', async t => {
  const { root } = await fixture(t);
  await mkdir(join(root, 'nested')); await writeFile(join(root, 'nested/index.html'), '<link href="style.css">');
  await writeFile(join(root, 'nested/style.css'), 'nested CSS');
  const server = await start(root); t.after(() => server.close());
  for (const path of ['/nested%2f?x=1', '/nested%5c?x=1']) {
    const redirect = await http(server.url, path);
    assert.equal(redirect.status, 308, path); assert.equal(redirect.headers.location, '/nested/?x=1');
    const document = await fetch(new URL(path, server.url));
    assert.equal(document.url, new URL('/nested/?x=1', server.url).href);
    const html = await document.text();
    const asset = await fetch(new URL(html.match(/href="([^"]+)"/)[1], document.url));
    assert.equal(asset.status, 200); assert.equal(await asset.text(), 'nested CSS');
  }
});
test('preview rejects traversal, hidden files and symlinks outside root', async t => {
  const { root, temp } = await fixture(t); await writeFile(join(temp, 'secret.txt'), 'secret'); await writeFile(join(root, '.env'), 'secret');
  await mkdir(join(root, '.private')); await writeFile(join(root, '.private/data'), 'secret');
  await symlink(join(temp, 'secret.txt'), join(root, 'leak.txt'));
  const server = await start(root); t.after(() => server.close());
  for (const path of ['/../secret.txt', '/%2e%2e/secret.txt', '/.env', '/.private/data', '/leak.txt', '/..%5csecret.txt']) assert.equal((await http(server.url, path)).status, 403, path);
});
test('preview fails for missing, invalid or non-directory roots', async t => {
  const { root } = await fixture(t);
  for (const value of [undefined, '', join(root, 'missing'), join(root, 'index.html')]) await assert.rejects(async () => start(value), /root|ENOENT|directory/i);
});
test('preview CLI reports JSON, stays alive and shuts down on SIGTERM', async t => {
  assert.equal(typeof preview.startPreview, 'function', 'startPreview export is missing');
  const { root } = await fixture(t);
  const child = spawn(process.execPath, ['scripts/preview.mjs', root], { cwd: new URL('..', import.meta.url), stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  let line = ''; for await (const chunk of child.stdout) { line += chunk; if (line.includes('\n')) break; }
  const info = JSON.parse(line.trim()); assert.equal(info.pid, child.pid); assert.equal(info.root, root); assert.equal((await http(info.url)).status, 200);
  const exited = once(child, 'exit'); assert.equal(child.kill('SIGTERM'), true);
  const [code, signal] = await exited;
  // Windows forcibly terminates SIGTERM targets without running POSIX signal handlers.
  if (process.platform !== 'win32') { assert.equal(code, 0); assert.equal(signal, null); }
  await assert.rejects(http(info.url), /ECONNREFUSED/);
});
test('capture measures PNG, hashes exact bytes and records actual clock time without guessing capturedAt', async t => {
  const { root } = await fixture(t); const bytes = png(12, 8); await writeFile(join(root, 'capture.png'), bytes);
  const before = Date.now(); const result = await record(options(root)); const after = Date.now();
  assert.equal(result.sha256, createHash('sha256').update(bytes).digest('hex')); assert.deepEqual(result.dimensions, { width: 12, height: 8 });
  assert.equal(result.capturedAt, null); assert.equal(result.captureProvenance, null); assert.ok(Date.parse(result.recordedAt) >= before && Date.parse(result.recordedAt) <= after);
  for (const key of ['revision', 'route', 'state', 'viewport', 'kind', 'actor', 'tool']) assert.deepEqual(result[key], options(root)[key]);
  assert.equal(result.file, 'capture.png');
  assert.equal(result.format, 'png'); assert.equal(result.mime, 'image/png');
});
test('capture rejects dimension mismatch for viewport and clip; full-page retains actual dimensions', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.png'), png(12, 18)); const base = options(root);
  await assert.rejects(async () => record(base), /dimension/i);
  const full = await record({ ...base, kind: 'full-page' }); assert.equal(full.dimensions.height, 18);
  await assert.rejects(async () => record({ ...base, kind: 'full-page', viewport: { width: 14, height: 8 } }), /dimension/i);
  const clip = { x: 2, y: 3, width: 12, height: 18 };
  assert.deepEqual((await record({ ...base, kind: 'clip', clip })).clip, clip);
  await assert.rejects(async () => record({ ...base, kind: 'clip', clip: { ...clip, width: 4 } }), /dimension/i);
  await assert.rejects(async () => record({ ...base, kind: 'clip' }), /clip/i);
});
test('capture only accepts explicit valid capturedAt with real provenance', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.png'), png(12, 8)); const base = options(root);
  await assert.rejects(async () => record({ ...base, capturedAt: '2026-10-16T12:00:00Z' }), /provenance/i);
  await assert.rejects(async () => record({ ...base, capturedAt: 'not-a-date', captureProvenance: 'tool receipt' }), /capturedAt/i);
  const result = await record({ ...base, capturedAt: '2026-10-16T12:00:00Z', captureProvenance: 'screenshot tool receipt #1' });
  assert.equal(result.capturedAt, '2026-10-16T12:00:00.000Z'); assert.equal(result.captureProvenance, 'screenshot tool receipt #1');
});
test('capture rejects outside paths, hidden files, invalid roots, absent and invalid PNGs', async t => {
  const { root, temp } = await fixture(t); await writeFile(join(temp, 'outside.png'), png(12, 8)); await symlink(join(temp, 'outside.png'), join(root, 'link.png'));
  await writeFile(join(root, '.hidden.png'), png(12, 8)); await writeFile(join(root, 'bad.png'), 'not PNG');
  for (const file of ['../outside.png', 'link.png', '.hidden.png', 'missing.png', 'bad.png']) await assert.rejects(async () => record({ ...options(root), file }));
  for (const value of [undefined, '', join(root, 'missing')]) await assert.rejects(async () => record({ ...options(root), root: value }));
  const truncated = png(12, 8).subarray(0, 33); await writeFile(join(root, 'capture.png'), truncated);
  await assert.rejects(async () => record(options(root)), /PNG/i);
});
test('capture requires revision, route, state, actor, tool and integer viewport', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.png'), png(12, 8));
  for (const key of ['revision', 'route', 'state', 'actor', 'tool']) await assert.rejects(async () => record({ ...options(root), [key]: '' }), new RegExp(key));
  await assert.rejects(async () => record({ ...options(root), viewport: { width: 0, height: 8 } }), /viewport/i);
  await assert.rejects(async () => record({ ...options(root), kind: 'window' }), /kind/i);
});
test('capture CLI emits evidence JSON and documents exact flags', async t => {
  assert.equal(typeof capture.recordCapture, 'function', 'recordCapture export is missing');
  const { root } = await fixture(t); await writeFile(join(root, 'capture.png'), png(12, 8));
  async function cli(args) { const child = spawn(process.execPath, ['scripts/record-capture.mjs', ...args], { cwd: new URL('..', import.meta.url) }); let stdout = '', stderr = ''; child.stdout.on('data', b => stdout += b); child.stderr.on('data', b => stderr += b); const [code] = await once(child, 'exit'); return { code, stdout, stderr }; }
  const result = await cli([root, 'capture.png', '--revision', 'sha256:abc', '--route', '/', '--state', 'idle', '--viewport', '12x8', '--kind', 'viewport', '--actor', 'controller', '--tool', 'native capture']);
  assert.equal(result.code, 0, result.stderr); assert.equal(JSON.parse(result.stdout).capturedAt, null);
  const help = await cli(['--help']); assert.equal(help.code, 0); for (const flag of ['--revision', '--viewport', '--captured-at', '--capture-provenance', '--clip', '--actor', '--tool']) assert.ok(help.stdout.includes(flag));
  const bad = await cli([root, 'capture.png', '--invented', 'x']); assert.equal(bad.code, 1); assert.match(bad.stderr, /unknown/i);
});

test('capture detects real JPEG bytes regardless of extension and records original hash and MIME', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.png'), jpeg);
  const result = await record({ ...options(root), viewport: { width: 3, height: 2 } });
  assert.deepEqual(result.dimensions, { width: 3, height: 2 });
  assert.equal(result.format, 'jpeg'); assert.equal(result.mime, 'image/jpeg');
  assert.equal(result.sha256, createHash('sha256').update(jpeg).digest('hex'));
  assert.equal(result.capturedAt, null); assert.equal(result.file, 'capture.png');
});
test('JPEG dimensions enforce viewport, full-page and declared clip contracts', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.jpg'), jpeg);
  const base = { ...options(root), file: 'capture.jpg', viewport: { width: 3, height: 2 } };
  await assert.rejects(() => record({ ...base, viewport: { width: 2, height: 3 } }), /dimension mismatch/i);
  const result = await record({ ...base, kind: 'full-page', viewport: { width: 3, height: 1 } });
  assert.equal(result.dimensions.height, 2); assert.equal(result.format, 'jpeg');
  const clip = { x: 1, y: 2, width: 3, height: 2 };
  assert.deepEqual((await record({ ...base, kind: 'clip', clip })).clip, clip);
  await assert.rejects(() => record({ ...base, kind: 'clip', clip: { ...clip, width: 2 } }), /dimension mismatch/i);
});
test('capture rejects malformed and truncated JPEG structure before recording evidence', async t => {
  const { root } = await fixture(t); const base = { ...options(root), viewport: { width: 3, height: 2 } };
  const sof = jpeg.indexOf(Buffer.from([0xff, 0xc0])); assert.ok(sof > 0);
  const sos = jpeg.indexOf(Buffer.from([0xff, 0xda])); assert.ok(sos > sof);
  const altered = change => { const bytes = Buffer.from(jpeg); change(bytes); return bytes; };
  const invalid = [
    jpeg.subarray(0, 3), jpeg.subarray(0, sof + 5), jpeg.subarray(0, -2),
    altered(b => b.writeUInt16BE(1, 4)), // Impossible APP segment length.
    altered(b => b.writeUInt16BE(0xffff, 4)), // Segment extends past EOF.
    altered(b => b.writeUInt16BE(7, sof + 2)), // SOF too short for component descriptors.
    altered(b => b.writeUInt16BE(0, sof + 5)), // Zero height cannot establish capture dimensions.
    altered(b => b[sof + 1] = 0xc4), // No SOF: an unrelated marker is not dimension evidence.
    altered(b => b.writeUInt16BE(0xffff, sos + 2)), // Truncated scan header.
    Buffer.concat([jpeg, Buffer.from('extra')]),
    Buffer.from([0xff, 0xd8, 0xff, 0xd9]) // No frame or scan.
  ];
  for (const [index, bytes] of invalid.entries()) {
    await writeFile(join(root, 'capture.png'), bytes);
    await assert.rejects(() => record(base), /JPEG/i, `malformed JPEG ${index}`);
  }
});
test('PNG CRC validation remains strict and unsupported image formats fail clearly', async t => {
  const { root } = await fixture(t); const bytes = png(12, 8); bytes[29] ^= 1;
  await writeFile(join(root, 'capture.png'), bytes); await assert.rejects(() => record(options(root)), /PNG/i);
  await writeFile(join(root, 'capture.png'), Buffer.from('GIF89a'));
  await assert.rejects(() => record(options(root)), /PNG or JPEG/i);
});
test('capture CLI supports JPEG and advertises byte-based format detection', async t => {
  const { root } = await fixture(t); await writeFile(join(root, 'capture.jpeg'), jpeg);
  async function cli(args) { const child = spawn(process.execPath, ['scripts/record-capture.mjs', ...args], { cwd: new URL('..', import.meta.url) }); let stdout = '', stderr = ''; child.stdout.on('data', b => stdout += b); child.stderr.on('data', b => stderr += b); const [code] = await once(child, 'exit'); return { code, stdout, stderr }; }
  const result = await cli([root, 'capture.jpeg', '--revision', 'sha256:abc', '--route', '/', '--state', 'idle', '--viewport', '3x2', '--actor', 'controller', '--tool', 'native JPEG capture']);
  assert.equal(result.code, 0, result.stderr); assert.equal(JSON.parse(result.stdout).format, 'jpeg'); assert.equal(JSON.parse(result.stdout).mime, 'image/jpeg');
  const help = await cli(['--help']); assert.match(help.stdout, /PNG or JPEG/); assert.match(help.stdout, /bytes/);
});
