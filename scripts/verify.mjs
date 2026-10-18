import { readFileSync, readdirSync, realpathSync, statSync, lstatSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, relative, dirname, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const vendorPins = Object.freeze({
  "vendor/frontend-design/SKILL.md": "d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3",
  "vendor/frontend-design/LICENSE.txt": "0d542e0c8804e39aa7f37eb00da5a762149dc682d7829451287e11b938e94594"
});
const policyPin = "7e89d8acdd7713d5f26cb9a44eea637462a013e6fb54aef804a2fc84bb1e697f";
const skillNames = ["design", "design-brief", "art-direction", "interaction-design",
  "design-system", "ui-build", "visual-review", "accessibility-review", "design-handoff"];
const requiredFiles = [
  "README.md", "CHANGELOG.md", "LICENSE", "THIRD_PARTY_NOTICES.md",
  "rules/design-router.mdc", "references/cursor-adapter.md",
  "references/browser-validation.md", "references/quality-rubric.md",
  "references/provenance.json", "scripts/preview.mjs",
  "scripts/record-capture.mjs", "scripts/identity-policy.json",
  "templates/workflow.md"
];
const manifestFields = new Set([
  "name", "version", "description", "author", "homepage", "repository",
  "license", "keywords", "skills", "rules"
]);
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function inside(root, path) {
  return path === root || path.startsWith(root + sep);
}

function safeFile(root, path) {
  const lexical = resolve(root, path);
  if (!inside(root, lexical) || !existsSync(lexical)) throw new Error("missing or outside file: " + path);
  const actual = realpathSync(lexical);
  if (!inside(root, actual) || !statSync(actual).isFile()) throw new Error("outside file: " + path);
  return actual;
}

function checkMarkdownLinks(root, file, body) {
  for (const match of body.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const raw = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) continue;
    let path;
    try { path = decodeURIComponent(raw.split(/[?#]/, 1)[0]); }
    catch { throw new Error("broken reference in " + file + ": " + raw); }
    if (!path) continue;
    const target = resolve(dirname(resolve(root, file)), path);
    if (!inside(root, target) || !existsSync(target) || !inside(root, realpathSync(target))) {
      throw new Error("broken reference in " + file + ": " + raw);
    }
  }
}

function portugueseCompanion(path) {
  for (const directory of ["docs", "references", "templates"]) {
    if (path.startsWith(directory + "/")) return directory + "/pt-BR/" + path.slice(directory.length + 1);
  }
  return path.replace(/\.md$/, ".pt-BR.md");
}

function checkBilingualDocumentation(root) {
  const ignored = new Set([".git", "node_modules", "coverage", "artifacts", "dist", "vendor"]);
  const canonical = [];
  function walk(dir) {
    for (const entry of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      const path = dir ? dir + "/" + entry.name : entry.name;
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) walk(path);
        continue;
      }
      if (!entry.isFile() || !path.endsWith(".md") || path === "THIRD_PARTY_NOTICES.md" ||
          path.includes("/pt-BR/") || path.endsWith(".pt-BR.md")) continue;
      canonical.push(path);
    }
  }
  walk("");
  for (const file of canonical.sort()) {
    const companion = portugueseCompanion(file);
    if (!existsSync(resolve(root, companion))) throw new Error("missing Portuguese companion: " + companion);
    const englishLink = relative(dirname(resolve(root, file)), resolve(root, companion)).split(sep).join("/");
    const portugueseLink = relative(dirname(resolve(root, companion)), resolve(root, file)).split(sep).join("/");
    if (!readFileSync(resolve(root, file), "utf8").includes(englishLink)) throw new Error("missing language link in " + file);
    if (!readFileSync(resolve(root, companion), "utf8").includes(portugueseLink)) throw new Error("missing language link in " + companion);
  }
}

function checkPublicSource(root, policy) {
  const ignored = new Set(policy.ignoredDirectories);
  const exceptions = new Set(policy.attributionExceptions);
  const patterns = [...policy.bannedPatterns, ...policy.hostPathPatterns].map(value => new RegExp(value, "i"));
  function walk(dir) {
    for (const entry of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      const path = dir ? dir + "/" + entry.name : entry.name;
      if (ignored.has(entry.name)) continue;
      if (entry.isSymbolicLink() || lstatSync(resolve(root, path)).isSymbolicLink()) {
        throw new Error("source path escape or symlink: " + path);
      }
      if (entry.isDirectory()) {
        if (patterns.some(pattern => pattern.test(path))) throw new Error("prohibited identity in path: " + path);
        walk(path);
        continue;
      }
      if (!entry.isFile()) continue;
      const body = readFileSync(resolve(root, path), "utf8");
      if (!exceptions.has(path)) {
        if (patterns.some(pattern => pattern.test(path))) throw new Error("prohibited identity in path: " + path);
        if (patterns.some(pattern => pattern.test(body))) throw new Error("prohibited identity in " + path);
      }
      if ([".md", ".mdc", ".markdown"].includes(extname(path).toLowerCase())) checkMarkdownLinks(root, path, body);
    }
  }
  walk("");
}

export function verify(root) {
  root = realpathSync(resolve(root));
  const read = path => readFileSync(safeFile(root, path), "utf8");
  const manifest = JSON.parse(read(".cursor-plugin/plugin.json"));
  const packageJson = JSON.parse(read("package.json"));
  if (manifest.name !== "design" || packageJson.name !== "dev-design") throw new Error("package or manifest name mismatch");
  if (packageJson.version !== manifest.version) throw new Error("version mismatch");
  if (typeof manifest.version !== "string" || !semver.test(manifest.version)) throw new Error("invalid SemVer version");
  if (packageJson.private !== false || packageJson.engines?.node !== ">=22.14.0" ||
      packageJson.bin?.["dev-design"] !== "./bin/dev-design.mjs" ||
      packageJson.publishConfig?.access !== "public") throw new Error("npm package contract mismatch");
  if (manifest.skills !== "./skills/" || manifest.rules !== "./rules/") throw new Error("Cursor manifest contract mismatch");
  for (const field of Object.keys(manifest)) {
    if (!manifestFields.has(field)) throw new Error("unsupported manifest field: " + field);
  }
  const repository = "https://github.com/alty-oss/dev-design";
  if (packageJson.repository !== repository || manifest.repository !== repository ||
      packageJson.homepage !== repository || manifest.homepage !== repository ||
      packageJson.author !== "AngeloResplandes" || manifest.author?.name !== "AngeloResplandes" ||
      packageJson.license !== "Apache-2.0" || manifest.license !== "Apache-2.0") {
    throw new Error("public repository metadata mismatch");
  }
  for (const path of requiredFiles) {
    if (!read(path).trim()) throw new Error("empty file: " + path);
  }
  const actualSkills = readdirSync(resolve(root, "skills"), { withFileTypes: true }).map(entry => entry.name).sort();
  const wantedSkills = [...skillNames].sort();
  if (JSON.stringify(actualSkills) !== JSON.stringify(wantedSkills)) throw new Error("unexpected skill or skill set mismatch");
  for (const name of skillNames) {
    const body = read("skills/" + name + "/SKILL.md");
    const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter || !frontmatter[1].includes("name: " + name + "\n") ||
        !/^description: .+/m.test(frontmatter[1])) throw new Error("skill identity: " + name);
  }
  const provenance = JSON.parse(read("references/provenance.json"));
  if (JSON.stringify(readdirSync(resolve(root, "vendor")).sort()) !== JSON.stringify(["frontend-design"]) ||
      JSON.stringify(readdirSync(resolve(root, "vendor/frontend-design")).sort()) !== JSON.stringify(["LICENSE.txt", "SKILL.md"])) {
    throw new Error("vendor file set mismatch");
  }
  if (JSON.stringify(Object.keys(provenance.files).sort()) !== JSON.stringify(Object.keys(vendorPins).sort())) {
    throw new Error("provenance file set mismatch");
  }
  for (const [path, digest] of Object.entries(vendorPins)) {
    const actual = createHash("sha256").update(readFileSync(safeFile(root, path))).digest("hex");
    if (actual !== digest) throw new Error("vendor integrity mismatch: " + path);
    if (provenance.files[path] !== digest) throw new Error("provenance mismatch: " + path);
  }
  const policyPath = safeFile(root, "scripts/identity-policy.json");
  const policyHash = createHash("sha256").update(readFileSync(policyPath)).digest("hex");
  if (policyHash !== policyPin) throw new Error("identity policy integrity mismatch");
  const policy = JSON.parse(readFileSync(policyPath, "utf8"));
  checkBilingualDocumentation(root);
  checkPublicSource(root, policy);
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    verify(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
    console.log("package OK");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
