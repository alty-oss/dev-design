import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { join, dirname, relative, isAbsolute, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { inspectInstallation, installPlugin } from '../scripts/install.mjs';
const source = dirname(dirname(fileURLToPath(import.meta.url)));
function fixture(run) {
 // Match the installer's native canonicalization, including Windows 8.3 temp aliases.
 const temp = fs.realpathSync.native(fs.mkdtempSync(join(tmpdir(), 'design install ')));
 const root = join(temp,'source');
 fs.cpSync(source,root,{recursive:true,filter:p=>!p.split(/[\\/]/).some(x=>['.git','artifacts','node_modules','dist'].includes(x))});
 const target=join(temp,'home/.cursor/plugins/local/design');
 try { run({root,target,temp}); } finally { fs.rmSync(temp,{recursive:true,force:true}); }
}
test('inspection is read only; installs and recognizes identical bytes',()=>fixture(({root,target})=>{
 assert.equal(inspectInstallation({sourceRoot:root,targetRoot:target}).status,'missing');
 assert.equal(fs.existsSync(dirname(target)),false);
 assert.equal(installPlugin({sourceRoot:root,targetRoot:target}).status,'installed');
 assert.equal(inspectInstallation({sourceRoot:root,targetRoot:target}).status,'matching');
 assert.equal(installPlugin({sourceRoot:root,targetRoot:target}).status,'already-installed');
}));
test('differences and extras require explicit replacement and preserve backup',()=>fixture(({root,target})=>{
 installPlugin({sourceRoot:root,targetRoot:target}); fs.writeFileSync(join(target,'extra'),'preserve');
 assert.deepEqual(inspectInstallation({sourceRoot:root,targetRoot:target}).differences,['extra']);
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}),/replace/);
 const result=installPlugin({sourceRoot:root,targetRoot:target,replace:true});
 assert.equal(result.status,'updated'); assert.equal(fs.readFileSync(join(result.backupPath,'extra'),'utf8'),'preserve');
 const fromPlugins = relative(dirname(target), result.backupPath);
 assert.ok(fromPlugins === '..' || fromPlugins.startsWith('..' + sep) || isAbsolute(fromPlugins));
 fs.writeFileSync(join(target,'README.md'),'different');
 assert.equal(inspectInstallation({sourceRoot:root,targetRoot:target}).status,'different');
}));
test('invalid source, overlap, unsafe allowlist and symlinks fail before mutation',()=>fixture(({root,target,temp})=>{
 for(const dest of [root,join(root,'nested'),temp]) assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:dest}),/overlap/);
 fs.mkdirSync(dirname(target),{recursive:true}); fs.symlinkSync(root,target); assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}),/symlink/); fs.unlinkSync(target);
 fs.symlinkSync(root,join(temp,'linked')); assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:join(temp,'linked/design')}),/symlink/);
 fs.writeFileSync(join(root,'scripts/release-files.json'),JSON.stringify(['../escape']));
 assert.equal(inspectInstallation({sourceRoot:root,targetRoot:target}).status,'invalid'); assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}));
 assert.equal(fs.existsSync(target),false);
}));
test('copy corruption and write failures never promote; promotion failure restores old copy',()=>fixture(({root,target})=>{
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target},{fs:{...fs,copyFileSync(){throw Error('write denied');}}}),/write denied/);
 assert.equal(fs.existsSync(target),false);
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target},{fs:{...fs,copyFileSync(a,b){fs.copyFileSync(a,b); if(a.endsWith('README.md'))fs.appendFileSync(b,'corrupt');}}}),/bytes/);
 installPlugin({sourceRoot:root,targetRoot:target}); fs.writeFileSync(join(target,'extra'),'old');
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target,replace:true},{fs:{...fs,renameSync(a,b){if(b===target&&!a.includes('plugins-backups'))throw Error('promotion failed');fs.renameSync(a,b);}}}),/restored/);
 assert.equal(fs.readFileSync(join(target,'extra'),'utf8'),'old');
}));
test('CLI flags, check and dry-run use isolated home without writes',()=>fixture(({root,temp})=>{
 const home=join(temp,'isolated-home'); fs.mkdirSync(home);
 const cli=(...args)=>spawnSync(process.execPath,['scripts/install.mjs',...args],{cwd:root,env:{...process.env,HOME:home,USERPROFILE:home},encoding:'utf8'});
 for(const flag of ['--check','--dry-run','--help']) assert.equal(cli(flag).status,0);
 assert.deepEqual(fs.readdirSync(home),[]);
 for(const args of [['--wat'],['--check','--replace'],['--dry-run','--check']])assert.notEqual(cli(...args).status,0);
 assert.equal(cli().status,0); assert.ok(fs.existsSync(join(home,'.cursor/plugins/local/design/.cursor-plugin/plugin.json')));
}));
test('package binary delegates installer modes from an isolated home',()=>fixture(({root,temp})=>{
 const home=join(temp,'binary-home'); fs.mkdirSync(home);
 const cli=(...args)=>spawnSync(process.execPath,['bin/dev-design.mjs',...args],{cwd:root,env:{...process.env,HOME:home,USERPROFILE:home},encoding:'utf8'});
 for(const flag of ['--check','--dry-run','--help']) assert.equal(cli(flag).status,0,cli(flag).stderr);
 assert.match(cli('--help').stdout,/Usage: dev-design /);
 assert.equal(JSON.parse(cli('--check').stdout).status,'missing');
 assert.deepEqual(fs.readdirSync(home),[]);
 assert.equal(cli().status,0,cli().stderr);
 assert.ok(fs.existsSync(join(home,'.cursor/plugins/local/design/.cursor-plugin/plugin.json')));
 assert.equal(JSON.parse(cli('--check').stdout).status,'matching');
}));
test('source installer identifies its direct invocation in help output',()=>fixture(({root,temp})=>{
 const home=join(temp,'source-help-home'); fs.mkdirSync(home);
 const result=spawnSync(process.execPath,['scripts/install.mjs','--help'],{cwd:root,env:{...process.env,HOME:home,USERPROFILE:home},encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert.match(result.stdout,/Usage: node scripts\/install\.mjs /);
}));

test('explicit flat target keeps staging and backups beside target',()=>fixture(({root,temp})=>{
 const target=join(temp,'flat-target');
 installPlugin({sourceRoot:root,targetRoot:target});
 fs.writeFileSync(join(target,'extra'),'preserved');
 const result=installPlugin({sourceRoot:root,targetRoot:target,replace:true});
 const fromTemp = relative(temp, result.backupPath);
 assert.ok(fromTemp !== '' && fromTemp !== '..' && !fromTemp.startsWith('..' + sep) && !isAbsolute(fromTemp));
}));
test('invalid allowlist file kinds, duplicates and source integrity are refused',()=>{
 for(const bad of ['../escape','/absolute','skills','missing','README.md','.git/config'])fixture(({root,target})=>{
  const path=join(root,'scripts/release-files.json'),list=JSON.parse(fs.readFileSync(path));list.push(bad);fs.writeFileSync(path,JSON.stringify(list));
  assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}));assert.equal(fs.existsSync(target),false);
 });
 fixture(({root,target,temp})=>{
  fs.unlinkSync(join(root,'README.md'));fs.writeFileSync(join(temp,'outside'),'outside');fs.symlinkSync(join(temp,'outside'),join(root,'README.md'));
  assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}),/symlink/);
 });
 fixture(({root,target})=>{fs.appendFileSync(join(root,'vendor/frontend-design/SKILL.md'),'changed');assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target}),/integrity/);});
});
test('failed rollback reports recoverable backup location',()=>fixture(({root,target})=>{
 installPlugin({sourceRoot:root,targetRoot:target});fs.writeFileSync(join(target,'extra'),'backup');
 let backup;
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:target,replace:true},{fs:{...fs,renameSync(a,b){
  if(b===target)throw Error('rename denied');backup=b;fs.renameSync(a,b);
 }}}),/restoration failed.*backup:/);
 assert.equal(fs.readFileSync(join(backup,'extra'),'utf8'),'backup');
}));
test('filesystem case aliases cannot bypass source overlap checks',t=>fixture(({root,temp})=>{
 const alias=join(temp,'SOURCE');
 // Case-sensitive volumes cannot exercise the native alias relationship.
 if(!fs.existsSync(alias)){t.skip('Requires a case-insensitive filesystem');return;}
 assert.throws(()=>installPlugin({sourceRoot:root,targetRoot:join(alias,'nested')}),/overlap/);
 assert.equal(fs.existsSync(join(root,'nested')),false);
}));
test('filesystem root is an ancestor of the source and is rejected before diagnosis',()=>fixture(({root})=>{
 const child=spawnSync(process.execPath,['--input-type=module','-e',`
  import fs from 'node:fs';
  import { syncBuiltinESMExports } from 'node:module';
  import assert from 'node:assert/strict';
  import { installPlugin } from './scripts/install.mjs';
  import { parse } from 'node:path';
  fs.readdirSync=()=>{throw Error('Unexpected filesystem traversal');};
  syncBuiltinESMExports();
  assert.throws(()=>installPlugin({sourceRoot:process.argv[1],targetRoot:parse(process.argv[1]).root}),/overlap/);
 `,root],{cwd:source,encoding:'utf8'});
 assert.equal(child.status,0,child.stderr);
}));
