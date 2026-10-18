import { readFile, realpath, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function pngDimensions(bytes) {
  const fail = () => { throw new Error('Invalid or incomplete PNG'); };
  if (!bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) fail();
  let size, imageData = false, ended = false;
  for (let offset = 8; offset < bytes.length;) {
    if (offset + 12 > bytes.length) fail();
    const length = bytes.readUInt32BE(offset), end = offset + 12 + length;
    if (end > bytes.length) fail();
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    let crc = 0xffffffff;
    for (const b of bytes.subarray(offset + 4, end - 4)) { crc ^= b; for (let n = 0; n < 8; n++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
    if (((crc ^ 0xffffffff) >>> 0) !== bytes.readUInt32BE(end - 4)) fail();
    if (offset === 8 && type !== 'IHDR') fail();
    if (type === 'IHDR') {
      if (size || length !== 13) fail();
      size = { width: bytes.readUInt32BE(offset + 8), height: bytes.readUInt32BE(offset + 12) };
      if (!size.width || !size.height || size.width > 0x7fffffff || size.height > 0x7fffffff) fail();
    }
    if (type === 'IDAT') imageData = true;
    if (type === 'IEND') { if (length || end !== bytes.length) fail(); ended = true; }
    offset = end;
  }
  if (!size || !imageData || !ended) fail();
  return size;
}
function jpegDimensions(bytes) {
  const fail = () => { throw new Error('Invalid or incomplete JPEG'); };
  const frames = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2, measured, components, scans = 0, inScan = false, scanData = false;
  // Parse length-delimited segments and scan marker framing, never decoded pixels.
  while (offset < bytes.length) {
    if (inScan) {
      const markerAt = bytes.indexOf(0xff, offset);
      if (markerAt < 0) fail();
      if (markerAt > offset) scanData = true;
      offset = markerAt;
    }
    if (bytes[offset++] !== 0xff) fail();
    while (offset < bytes.length && bytes[offset] === 0xff) offset++;
    if (offset >= bytes.length) fail();
    const marker = bytes[offset++];
    if (inScan && (marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7))) {
      if (marker === 0x00) scanData = true; // Escaped literal 0xff, not a marker.
      continue;
    }
    if (inScan) { if (!scanData) fail(); inScan = false; }
    if (marker === 0xd9) {
      if (!measured || !scans || offset !== bytes.length) fail();
      return measured;
    }
    if (marker === 0x01) continue; // TEM is the other lengthless marker.
    if (marker < 0xc0 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) fail();
    if (offset + 2 > bytes.length) fail();
    const length = bytes.readUInt16BE(offset), end = offset + length;
    if (length < 2 || end > bytes.length) fail();
    if (frames.has(marker)) {
      if (measured || length < 8) fail();
      const precision = bytes[offset + 2];
      measured = { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
      components = bytes[offset + 7];
      if (!measured.width || !measured.height || !components || length !== 8 + 3 * components || !precision || precision > 16) fail();
    }
    if (marker === 0xda) {
      if (!measured || length < 6) fail();
      const count = bytes[offset + 2];
      if (!count || count > components || length !== 6 + 2 * count) fail();
      scans++; inScan = true; scanData = false;
    }
    offset = end;
  }
  fail();
}
function imageMetadata(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return { dimensions: pngDimensions(bytes), format: 'png', mime: 'image/png' };
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { dimensions: jpegDimensions(bytes), format: 'jpeg', mime: 'image/jpeg' };
  throw new Error('Unsupported image format: expected PNG or JPEG bytes');
}
function text(value, name) { if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required`); return value; }
function size(value, name) { if (!value || !['width', 'height'].every(key => Number.isSafeInteger(value[key]) && value[key] > 0)) throw new Error(`${name} must have positive integer width and height`); return { width: value.width, height: value.height }; }
const outside = path => path === '..' || path.startsWith('..' + sep) || isAbsolute(path);
const hidden = path => path.split(sep).some(part => part.startsWith('.'));

/** Integrity metadata only: does not create, modify, decode or visually inspect screenshots. */
export async function recordCapture(options) {
  const root = await realpath(resolve(text(options.root, 'root')));
  if (!(await stat(root)).isDirectory()) throw new Error('root must be a directory');
  const requested = resolve(root, text(options.file, 'file'));
  if (outside(relative(root, requested)) || hidden(relative(root, requested))) throw new Error('Capture path must be public and inside root');
  const file = await realpath(requested), path = relative(root, file);
  if (outside(path) || hidden(path)) throw new Error('Capture path must be public and inside root');
  if (!(await stat(file)).isFile()) throw new Error('Capture must be a PNG or JPEG file');
  const revision = text(options.revision, 'revision'), route = text(options.route, 'route'), state = text(options.state, 'state');
  const actor = text(options.actor, 'actor'), tool = text(options.tool, 'tool');
  const viewport = size(options.viewport, 'viewport'), kind = options.kind ?? 'viewport';
  if (!['viewport', 'full-page', 'clip'].includes(kind)) throw new Error('kind must be viewport, full-page or clip');
  let clip = null;
  if (kind === 'clip') {
    clip = { ...size(options.clip, 'clip') };
    for (const key of ['x', 'y']) { if (!Number.isSafeInteger(options.clip[key]) || options.clip[key] < 0) throw new Error('clip x/y must be non-negative integers'); clip[key] = options.clip[key]; }
  } else if (options.clip != null) throw new Error('clip is only valid for kind clip');
  let capturedAt = null, captureProvenance = null;
  if (options.capturedAt != null) {
    captureProvenance = text(options.captureProvenance, 'capture provenance');
    if (typeof options.capturedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(options.capturedAt) || !Number.isFinite(Date.parse(options.capturedAt))) throw new Error('capturedAt must be an ISO timestamp with timezone from the capture tool');
    capturedAt = new Date(options.capturedAt).toISOString();
  } else if (options.captureProvenance != null) throw new Error('capture provenance requires capturedAt');
  const bytes = await readFile(file), image = imageMetadata(bytes), measured = image.dimensions, expected = clip ?? viewport;
  if (measured.width !== expected.width || (kind === 'full-page' ? measured.height < expected.height : measured.height !== expected.height)) throw new Error(`Image dimension mismatch: measured ${measured.width}x${measured.height}; expected ${expected.width}x${kind === 'full-page' ? '>=' : ''}${expected.height}`);
  return { file: path.split(sep).join('/'), sha256: createHash('sha256').update(bytes).digest('hex'), dimensions: measured, format: image.format, mime: image.mime, revision, route, state, viewport, kind, clip, actor, tool, capturedAt, captureProvenance, recordedAt: new Date().toISOString() };
}
const help = `Usage: node <plugin>/scripts/record-capture.mjs <project-root> <image-path> [flags]
Required flags:
  --revision <commit-or-source-hash>  Exact tested source revision (include dirty hashes)
  --route <route> --state <state>     Actual rendered route and state
  --viewport <WIDTHxHEIGHT>          Requested CSS viewport; pixel ratio must be 1
  --actor <actor> --tool <tool>       Capture actor and documented tool/API
Optional flags:
  --kind <viewport|full-page|clip>    Default viewport; full-page width equals viewport,
                                    height must be at least viewport height
  --clip <X,Y,WIDTH,HEIGHT>           Required for clip; validates only this region
  --captured-at <ISO-with-timezone>   Only a real capture-tool timestamp
  --capture-provenance <receipt>     Required with --captured-at; otherwise both null
  --help                            Show this help
Print one capture JSON record to stdout; append it to existing evidence only after inspecting
its unchanged image. Accepts PNG or JPEG detected from bytes, regardless of file extension;
records format and image MIME. No conversion, pixel decoding, visual certification or repeated-strip detection.
recordedAt is the actual recording clock, never the capture time. Errors exit 1.
`;
const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  if (process.argv.length === 3 && process.argv[2] === '--help') console.log(help);
  else try {
    const [root, file, ...args] = process.argv.slice(2), options = { root, file };
    const flags = { '--revision': 'revision', '--route': 'route', '--state': 'state', '--viewport': 'viewport', '--kind': 'kind', '--clip': 'clip', '--actor': 'actor', '--tool': 'tool', '--captured-at': 'capturedAt', '--capture-provenance': 'captureProvenance' };
    for (let i = 0; i < args.length; i += 2) {
      const key = flags[args[i]]; if (!key) throw new Error('Unknown flag: ' + args[i]);
      if (!args[i + 1] || args[i + 1].startsWith('--') || options[key] !== undefined) throw new Error('Missing or duplicate value: ' + args[i]);
      options[key] = args[i + 1];
    }
    if (typeof options.viewport !== 'string' || !/^\d+x\d+$/.test(options.viewport)) throw new Error('--viewport WIDTHxHEIGHT is required');
    const [width, height] = options.viewport.split('x').map(Number); options.viewport = { width, height };
    if (options.clip !== undefined) { if (!/^\d+,\d+,\d+,\d+$/.test(options.clip)) throw new Error('--clip requires X,Y,WIDTH,HEIGHT'); const [x, y, width, height] = options.clip.split(',').map(Number); options.clip = { x, y, width, height }; }
    console.log(JSON.stringify(await recordCapture(options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
