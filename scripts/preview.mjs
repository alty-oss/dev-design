import { createServer } from 'node:http';
import { realpath, stat, readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const outside = path => path === '..' || path.startsWith('..' + sep) || isAbsolute(path);
const hidden = path => path.split(sep).some(part => part.startsWith('.'));

/** Static local preview only. The caller owns close(); port 0 asks the OS for a free port. */
export async function startPreview(projectRoot) {
  if (typeof projectRoot !== 'string' || !projectRoot.trim()) throw new Error('An explicit project root is required');
  const root = await realpath(resolve(projectRoot));
  if (!(await stat(root)).isDirectory()) throw new Error('Project root must be a directory');
  const server = createServer(async (req, res) => {
    const respond = (status, body) => { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(req.method === 'HEAD' ? undefined : body); };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); respond(405, 'Method not allowed'); return; }
    const pathname = req.url.split('?')[0];
    let path;
    try { path = decodeURIComponent(pathname); } catch { respond(400, 'Invalid path encoding'); return; }
    if (!path.startsWith('/') || path.includes('\0')) { respond(400, 'Invalid path'); return; }
    // Check before normalization: URL parsers and resolve() otherwise erase traversal segments.
    const parts = path.replaceAll('\\', '/').split('/').filter(Boolean);
    if (parts.some(part => part.startsWith('.'))) { respond(403, 'Path is not public'); return; }
    try {
      let file = resolve(root, ...parts);
      if (outside(relative(root, file))) { respond(403, 'Path outside project root'); return; }
      file = await realpath(file);
      if (outside(relative(root, file)) || hidden(relative(root, file))) { respond(403, 'Path is not public'); return; }
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          // Encode decoded segments separately so even //names remain same-origin paths.
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          const location = '/' + parts.map(part => encodeURIComponent(part)).join('/') + (parts.length ? '/' : '') + query;
          res.writeHead(308, { Location: location, 'Cache-Control': 'no-store' }); res.end(); return;
        }
        file = await realpath(resolve(file, 'index.html'));
      }
      if (outside(relative(root, file)) || hidden(relative(root, file))) { respond(403, 'Path is not public'); return; }
      if (!(await stat(file)).isFile()) { respond(404, 'File not found'); return; }
      const bytes = await readFile(file);
      const type = mime[extname(file).toLowerCase()] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': /^(text\/|application\/json)/.test(type) ? type + '; charset=utf-8' : type, 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR'].includes(error.code)) respond(404, 'File not found');
      else if (['EACCES', 'EPERM', 'ELOOP'].includes(error.code)) respond(403, 'Path is not public');
      else respond(500, 'Unable to serve file');
    }
  });
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => { server.off('error', reject); accept(); }); });
  let closing;
  const close = () => closing ??= new Promise((accept, reject) => { server.close(error => error ? reject(error) : accept()); server.closeIdleConnections(); });
  return { root, pid: process.pid, url: `http://127.0.0.1:${server.address().port}/`, server, close };
}
const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  if (process.argv[2] === '--help') console.log('Usage: node <plugin>/scripts/preview.mjs <project-root>\nServe explicit static project root on 127.0.0.1 and an OS-chosen port. Prints JSON {url,root,pid}. Keep process alive; stop with Ctrl-C or SIGTERM.');
  else try {
    if (process.argv.length !== 3) throw new Error('Usage: node <plugin>/scripts/preview.mjs <project-root>');
    const preview = await startPreview(process.argv[2]);
    console.log(JSON.stringify({ url: preview.url, root: preview.root, pid: preview.pid }));
    const stop = async () => { try { await preview.close(); } catch (error) { console.error(error.message); process.exitCode = 1; } };
    process.once('SIGINT', stop); process.once('SIGTERM', stop);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
