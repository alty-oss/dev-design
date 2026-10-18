import * as nativeFs from 'node:fs';
import { resolve, join, dirname, basename, sep, parse } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { verify } from './verify.mjs';

function stat(path) {
  try { return nativeFs.lstatSync(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function safeAncestors(path) {
  let current = parse(path).root;
  for (const part of path.slice(current.length).split(sep).filter(Boolean)) {
    current = join(current, part);
    const info = stat(current);
    if (info?.isSymbolicLink()) throw new Error('Unsafe symlink: ' + current);
    if (info && current !== path && !info.isDirectory()) throw new Error('Ancestor is not a directory: ' + current);
  }
}
function inside(a,b) { return a === b || b.startsWith(a.endsWith(sep) ? a : a + sep); }
function canonicalPath(path) {
  safeAncestors(path);
  let ancestor=path;
  const missing=[];
  while(!stat(ancestor)) {
    missing.unshift(basename(ancestor));
    ancestor=dirname(ancestor);
  }
  return join(nativeFs.realpathSync.native(ancestor),...missing);
}
function prepare({ sourceRoot, targetRoot }) {
  if (typeof sourceRoot !== 'string' || typeof targetRoot !== 'string') throw new Error('sourceRoot and targetRoot are required');
  const source = canonicalPath(resolve(sourceRoot)), target = canonicalPath(resolve(targetRoot));
  if (inside(source,target) || inside(target,source)) throw new Error('Source and target overlap');
  safeAncestors(source); safeAncestors(target);
  const files = JSON.parse(nativeFs.readFileSync(join(source,'scripts/release-files.json'),'utf8'));
  if (!Array.isArray(files) || !files.length || new Set(files).size !== files.length) throw new Error('Invalid release allowlist');
  for (const file of files) {
    if (typeof file !== 'string' || !/^[a-zA-Z0-9._/-]+$/.test(file) || file.startsWith('/') || file.split('/').some(p=>!p || p==='.' || p==='..' || p==='.git')) throw new Error('Unsafe release allowlist entry');
    safeAncestors(join(source,file));
    if (!stat(join(source,file))?.isFile()) throw new Error('Invalid release file: '+file);
  }
  verify(source);
  return {source,target,files,version:JSON.parse(nativeFs.readFileSync(join(source,'package.json'),'utf8')).version};
}
function diagnose({source,target,files,version}) {
  const result = {status:'missing',sourceVersion:version,installedVersion:null,differences:[],nextSteps:[]};
  const info=stat(target);
  if (!info) { result.nextSteps=['Run the installer to create the local copy.']; return result; }
  if (!info.isDirectory()) return {...result,status:'invalid',differences:['.'],nextSteps:['Target must be a regular directory.']};
  try { safeAncestors(join(target,'package.json')); result.installedVersion=JSON.parse(nativeFs.readFileSync(join(target,'package.json'),'utf8')).version ?? null; } catch {}
  const expected = new Set(files), differences=new Set();
  const directories=new Set(files.flatMap(file=>{const parts=file.split('/');return parts.slice(0,-1).map((_,i)=>parts.slice(0,i+1).join('/'));}));
  function walk(dir) {
    for(const entry of nativeFs.readdirSync(join(target,dir),{withFileTypes:true})) {
      const path=dir ? dir+'/'+entry.name : entry.name;
      if(entry.isDirectory()) { if(!directories.has(path))differences.add(path); walk(path); }
      else if(!entry.isFile() || !expected.has(path))differences.add(path);
    }
  }
  walk('');
  for(const file of files) {
    try { safeAncestors(join(target,file)); if(!stat(join(target,file))?.isFile() || !nativeFs.readFileSync(join(source,file)).equals(nativeFs.readFileSync(join(target,file))))differences.add(file); }
    catch { differences.add(file); }
  }
  result.differences=[...differences].sort(); result.status=differences.size?'different':'matching';
  result.nextSteps=differences.size?['Use --replace to preserve a backup and replace this copy.']:['Distributed bytes match; confirm loading in Cursor separately.'];
  return result;
}
export function inspectInstallation(options) {
  try { return diagnose(prepare(options)); }
  catch(error) { return {status:'invalid',sourceVersion:null,installedVersion:null,differences:[],nextSteps:[error.message]}; }
}
export function installPlugin(options, dependencies = {}) {
  const fs=dependencies.fs ?? nativeFs;
  const context=prepare(options), inspection=diagnose(context);
  if(inspection.status==='invalid')throw new Error(inspection.nextSteps.join(' '));
  if(inspection.status==='matching')return {status:'already-installed',version:context.version,backupPath:null};
  if(inspection.status==='different'&&!options.replace)throw new Error('Target differs; use --replace to back up and replace it');
  const {source,target,files,version}=context;
  // Sibling of plugins, never a child of plugins/local. Explicit destinations use the same layout.
  const cursorRoot=basename(dirname(target))==='local' && basename(dirname(dirname(target)))==='plugins'
    ? dirname(dirname(dirname(target))) : dirname(target);
  const stagingRoot=canonicalPath(join(cursorRoot,'plugins-staging')), backupRoot=canonicalPath(join(cursorRoot,'plugins-backups'));
  safeAncestors(stagingRoot); safeAncestors(backupRoot);
  if(inside(source,stagingRoot)||inside(source,backupRoot)||inside(target,stagingRoot)||inside(target,backupRoot))throw new Error('Unsafe staging or backup overlap');
  let staging, backupPath=null, moved=false;
  try {
    fs.mkdirSync(stagingRoot,{recursive:true}); staging=fs.mkdtempSync(join(stagingRoot,'design-'));
    for(const file of files) {fs.mkdirSync(dirname(join(staging,file)),{recursive:true});fs.copyFileSync(join(source,file),join(staging,file));}
    for(const file of files) if(!nativeFs.readFileSync(join(source,file)).equals(nativeFs.readFileSync(join(staging,file))))throw new Error('Copied bytes mismatch: '+file);
    verify(staging);
    safeAncestors(target);
    if(inspection.status==='missing' && stat(target))throw new Error('Target appeared during installation; inspect and retry');
    if(inspection.status==='different') {
      fs.mkdirSync(backupRoot,{recursive:true});
      const holder=fs.mkdtempSync(join(backupRoot,'design-')); backupPath=join(holder,'design');
      fs.renameSync(target,backupPath); moved=true;
    }
    fs.mkdirSync(dirname(target),{recursive:true}); fs.renameSync(staging,target); staging=null;
    return {status:moved?'updated':'installed',version,backupPath};
  } catch(error) {
    if(moved) {
      try {fs.renameSync(backupPath,target);throw new Error('Installation failed; previous copy restored: '+error.message);}
      catch(restoreError) { if(restoreError.message.startsWith('Installation failed;'))throw restoreError;throw new Error('Installation failed: '+error.message+'; restoration failed: '+restoreError.message+'; backup: '+backupPath); }
    }
    throw new Error('Installation failed: '+error.message);
  } finally {if(staging)fs.rmSync(staging,{recursive:true,force:true});}
}
export function runInstallerCli({
  args = process.argv.slice(2),
  sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)),'..'),
  targetRoot = join(homedir(),'.cursor/plugins/local/design'),
  stdout = message => console.log(message),
  stderr = message => console.error(message)
} = {}) {
  try {
    if(args.length>1 || (args.length&&!['--help','--check','--dry-run','--replace'].includes(args[0])))throw new Error('Use one of --help, --check, --dry-run, --replace, or no flags');
    if(args[0]==='--help')stdout('Usage: design [--help | --check | --dry-run | --replace]\nInstalls local files; Cursor loading must be confirmed separately.');
    else {
      const options={sourceRoot,targetRoot,replace:args[0]==='--replace'};
      if(['--check','--dry-run'].includes(args[0])) {
        const result=inspectInstallation(options);stdout(JSON.stringify({...result,...(args[0]==='--dry-run'?{operations:['Validate and stage allowlisted files outside plugins/local; promote only a verified copy.'],targetRoot:options.targetRoot}:{})},null,2));if(result.status==='invalid') { process.exitCode=1; return 1; }
      } else stdout(JSON.stringify(installPlugin(options),null,2));
    }
    return 0;
  } catch(error) {stderr(error.message);process.exitCode=1;return 1;}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  runInstallerCli();
}
