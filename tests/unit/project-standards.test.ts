import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireRuntime } from "../../scripts/lib/runtime.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const text = (path: string): string => readFileSync(root + path, "utf8");
const json = (path: string): Record<string, unknown> =>
  JSON.parse(text(path)) as Record<string, unknown>;

const exactPatch = /^\d+\.\d+\.\d+$/;
const pin = (): string => text(".node-version").trim();

function miseNode(): string {
  const match = /^\s*node\s*=\s*"([^"]+)"/m.exec(text("mise.toml"));
  assert.ok(match, "mise.toml has no node = \"...\" line");
  return match[1] ?? "";
}

function workflowNodeVersions(path: string): { versions: string[]; setups: number } {
  const body = text(path);
  const versions = [...body.matchAll(/^\s*node-version:\s*["']?([^\s"'#]+)/gm)].map(
    (m) => m[1] ?? "",
  );
  const setups = [...body.matchAll(/uses:\s*actions\/setup-node@/g)].length;
  return { versions, setups };
}

function scripts(): Record<string, string> {
  return (json("package.json").scripts ?? {}) as Record<string, string>;
}

test("project standards: .node-version is one exact patch and equals mise.toml", () => {
  assert.match(pin(), exactPatch);
  assert.equal(miseNode(), pin());
});

test("project standards: every workflow pins the same Node as .node-version", () => {
  for (const file of [".github/workflows/deploy.yml", ".github/workflows/portability.yml"]) {
    const { versions, setups } = workflowNodeVersions(file);
    assert.ok(versions.length > 0, `${file} pins no Node version`);
    assert.equal(versions.length, setups, `${file}: every setup-node needs a node-version`);
    for (const version of versions) assert.equal(version, pin(), file);
  }
});

test("project standards: engines floor equals the pin", () => {
  const engines = (json("package.json").engines ?? {}) as { node?: string };
  assert.equal(engines.node, `>=${pin()}`);
});

test("project standards: the runtime guard accepts the pin and rejects the previous minor", () => {
  assert.doesNotThrow(() => requireRuntime(pin()));
  const [major = 0, minor = 0] = pin().split(".").map(Number);
  if (minor > 0) assert.throws(() => requireRuntime(`${major}.${minor - 1}.0`));
});

test("project standards: check script is typecheck plus unit tests plus PHP lint, nothing heavier", () => {
  const check = scripts().check;
  assert.equal(typeof check, "string");
  const body = String(check);
  for (const part of ["npm run typecheck", "npm test", "php -l"]) assert.ok(body.includes(part), part);
  assert.doesNotMatch(body, /playwright|test:browser|vite build|npm run build|test:mail/);
});

test("project standards: check and release.json run the same PHP lint", () => {
  const checks = (json("release.json").checks ?? []) as string[];
  assert.ok(checks.includes("npm run typecheck"));
  assert.ok(checks.includes("npm test"));
  const lint = checks.filter((c) => c.includes("php -l"));
  assert.equal(lint.length, 1);
  assert.ok(String(scripts().check).includes(lint[0] ?? "\u0000"));
});
