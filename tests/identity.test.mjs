import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, cpSync, rmSync, writeFileSync, readFileSync, mkdirSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { verify } from "../scripts/verify.mjs";

const source = dirname(dirname(fileURLToPath(import.meta.url)));
const priorName = JSON.parse(readFileSync(join(source, "references/provenance.json"), "utf8")).application.split(" ")[0];
function fixture(run) {
  const temp = mkdtempSync(join(tmpdir(), "design-identity-test-"));
  const root = join(temp, "plugin");
  cpSync(source, root, { recursive: true, filter: path => !path.split(/[\\/]/).some(part => [".git", "node_modules", "coverage", "artifacts", "dist"].includes(part)) });
  try { run(root); } finally { rmSync(temp, { recursive: true, force: true }); }
}
test("a prohibited term in a public source file fails regardless of case", () => fixture(root => {
  writeFileSync(join(root, "source-note.txt"), priorName.toUpperCase());
  assert.throws(() => verify(root), /prohibited|identity/i);
}));
test("a prohibited term in a public path fails", () => fixture(root => {
  const path = join(root, priorName.toUpperCase());
  mkdirSync(path);
  writeFileSync(join(path, "note.txt"), "ordinary content");
  assert.throws(() => verify(root), /prohibited|identity/i);
}));
test("an absolute personal host path fails", () => fixture(root => {
  const hostPath = ["", "Users", "example", "Documents", "private"].join("/");
  writeFileSync(join(root, "source-note.txt"), hostPath);
  assert.throws(() => verify(root), /host path|absolute path|identity/i);
}));
test("explicit attribution files may retain source identity", () => fixture(root => {
  appendFileSync(join(root, "THIRD_PARTY_NOTICES.md"), "\n" + priorName);
  assert.doesNotThrow(() => verify(root));
}));
test("ignored generated directories do not affect the source scan", () => fixture(root => {
  for (const name of [".git", "node_modules", "coverage", "artifacts", "dist"]) {
    mkdirSync(join(root, name), { recursive: true });
    writeFileSync(join(root, name, "note.txt"), priorName);
  }
  assert.doesNotThrow(() => verify(root));
}));
test("editing scanner exceptions cannot exempt a public document", () => fixture(root => {
  const path = join(root, "scripts/identity-policy.json");
  const policy = JSON.parse(readFileSync(path, "utf8"));
  policy.attributionExceptions.push("docs/new-guide.md");
  writeFileSync(path, JSON.stringify(policy));
  writeFileSync(join(root, "docs/new-guide.md"), priorName);
  assert.throws(() => verify(root), /policy|exception|identity/i);
}));
