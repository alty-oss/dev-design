import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, cpSync, rmSync, writeFileSync, readFileSync, appendFileSync, mkdirSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { verify } from "../scripts/verify.mjs";

const source = dirname(dirname(fileURLToPath(import.meta.url)));
function fixture(run) {
  const temp = mkdtempSync(join(tmpdir(), "design-plugin-test-"));
  const root = join(temp, "plugin");
  cpSync(source, root, {
    recursive: true,
    filter: path => !path.split(/[\\/]/).some(part => [".git", "node_modules", "coverage", "artifacts", "dist"].includes(part))
  });
  try { run(root, temp); } finally { rmSync(temp, { recursive: true, force: true }); }
}
function editJson(root, path, edit) {
  const file = join(root, path);
  const data = JSON.parse(readFileSync(file, "utf8"));
  edit(data);
  writeFileSync(file, JSON.stringify(data));
}

test("complete package passes", () => fixture(root => assert.doesNotThrow(() => verify(root))));
test("a later matching valid version passes", () => fixture(root => {
  editJson(root, "package.json", data => data.version = "1.2.3-beta.1");
  editJson(root, ".cursor-plugin/plugin.json", data => data.version = "1.2.3-beta.1");
  assert.doesNotThrow(() => verify(root));
}));
test("npm package and Cursor plugin identities are fixed independently", () => fixture(root => {
  editJson(root, "package.json", data => data.name = "other-name");
  assert.throws(() => verify(root), /name|identity/i);
}));
test("invalid matching versions are rejected", () => fixture(root => {
  editJson(root, "package.json", data => data.version = "latest");
  editJson(root, ".cursor-plugin/plugin.json", data => data.version = "latest");
  assert.throws(() => verify(root), /version|semver/i);
}));
test("mismatched versions are rejected", () => fixture(root => {
  editJson(root, "package.json", data => data.version = "1.0.0");
  assert.throws(() => verify(root), /version mismatch/i);
}));
test("unsupported manifest fields are rejected", () => fixture(root => {
  editJson(root, ".cursor-plugin/plugin.json", data => data.unrecognizedField = true);
  assert.throws(() => verify(root), /manifest field|unsupported/i);
}));
test("canonical repository metadata is accepted while plugin identity stays design", () => fixture(root => {
  const repository = "https://github.com/alty-oss/dev-design";
  for (const file of ["package.json", ".cursor-plugin/plugin.json"]) {
    editJson(root, file, data => { data.repository = repository; data.homepage = repository; });
  }
  assert.doesNotThrow(() => verify(root));
  assert.equal(JSON.parse(readFileSync(join(root, ".cursor-plugin/plugin.json"), "utf8")).name, "design");
}));
test("public metadata points to the intended repository", () => fixture(root => {
  editJson(root, "package.json", data => data.repository = "https://example.org/other");
  assert.throws(() => verify(root), /repository|metadata/i);
}));
test("release workflow rejects an npm version whose immutable bytes differ", () => {
  const workflow = readFileSync(join(source, ".github/workflows/release.yml"), "utf8");
  assert.match(workflow, /npm pack --pack-destination/);
  assert.match(workflow, /local_integrity=/);
  assert.match(workflow, /published_integrity=/);
  assert.match(workflow, /\[ "\$published_integrity" = "\$local_integrity" \]/);
  assert.match(workflow, /npm publish "\$archive" --access public/);
});
test("every maintained document has a Portuguese companion", () => fixture(root => {
  rmSync(join(root, "README.pt-BR.md"));
  assert.throws(() => verify(root), /Portuguese companion/i);
}));
test("a worktree git-file is not scanned as public source", () => fixture(root => {
  writeFileSync(join(root, ".git"), "gitdir: " + ["", "Users", "example", ".git", "worktrees", "design"].join("/") + "\n");
  assert.doesNotThrow(() => verify(root));
}));
test("an unexpected skill is rejected", () => fixture(root => {
  mkdirSync(join(root, "skills/extra"));
  writeFileSync(join(root, "skills/extra/SKILL.md"), "---\nname: extra\ndescription: Extra\n---\n");
  assert.throws(() => verify(root), /unexpected skill|skill set/i);
}));
test("skill frontmatter identity is checked", () => fixture(root => {
  const path = join(root, "skills/design/SKILL.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("name: design", "name: something-else"));
  assert.throws(() => verify(root), /skill identity/i);
}));
test("missing manifest and runtime components are rejected", () => {
  for (const path of [".cursor-plugin/plugin.json", "scripts/preview.mjs", "scripts/record-capture.mjs", "references/browser-validation.md", "templates/workflow.md"]) fixture(root => {
    rmSync(join(root, path));
    assert.throws(() => verify(root));
  });
});
test("local links are checked in every shipped Markdown area", () => {
  for (const path of ["references/cursor-adapter.md", "templates/workflow.md", "skills/design/SKILL.md", "docs/usage.md"]) fixture(root => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    appendFileSync(join(root, path), "\n[missing](./no-such-guide.md)\n");
    assert.throws(() => verify(root), /broken reference.*no-such-guide/i);
  });
});
test("Markdown links cannot escape through a symlink", () => fixture((root, temp) => {
  writeFileSync(join(temp, "outside.md"), "outside");
  symlinkSync(temp, join(root, "references/external"));
  appendFileSync(join(root, "references/cursor-adapter.md"), "\n[escape](external/outside.md)\n");
  assert.throws(() => verify(root), /outside|escape|broken reference/i);
}));
test("vendor tampering fails even if editable provenance changes", () => fixture(root => {
  const path = "vendor/frontend-design/SKILL.md";
  appendFileSync(join(root, path), "\nchanged");
  editJson(root, "references/provenance.json", data => data.files[path] = "0".repeat(64));
  assert.throws(() => verify(root), /vendor integrity/i);
}));
test("provenance must contain exactly the pinned vendor paths", () => fixture(root => {
  editJson(root, "references/provenance.json", data => data.files["vendor/extra.txt"] = "0".repeat(64));
  assert.throws(() => verify(root), /provenance/i);
}));
test("unrecorded files in the vendor directory are rejected", () => fixture(root => {
  writeFileSync(join(root, "vendor/frontend-design/extra.txt"), "extra");
  assert.throws(() => verify(root), /vendor|provenance/i);
}));
test("a clone with automatic CRLF checkout preserves verifiable source bytes", () => fixture((root, temp) => {
  const git = (...args) => execFileSync("git", args, { stdio: "pipe" });
  git("-C", root, "init", "-q");
  git("-C", root, "config", "user.name", "Fixture");
  git("-C", root, "config", "user.email", "fixture@example.invalid");
  git("-C", root, "add", "-A");
  git("-C", root, "commit", "-qm", "fixture");
  const clone = join(temp, "windows-checkout");
  git("-c", "core.autocrlf=true", "clone", "-q", root, clone);
  assert.doesNotThrow(() => verify(clone));
  for (const path of [
    "vendor/frontend-design/SKILL.md",
    "vendor/frontend-design/LICENSE.txt",
    "scripts/identity-policy.json"
  ]) {
    assert.deepEqual(readFileSync(join(clone, path)), readFileSync(join(root, path)), path);
  }
}));
