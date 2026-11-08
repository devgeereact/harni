// Guards against code and CSS that nothing uses (Phase 3, CLN-01 to CLN-03). Run: npm test
// They read source files only; nothing is built or written.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "../../src/content/routes.ts";
import { site } from "../../src/content/site.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const text = (path: string): string => readFileSync(root + path, "utf8");

function walk(dir: string, keep: (file: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(root + dir)) {
    const rel = join(dir, name);
    if (statSync(root + rel).isDirectory()) out.push(...walk(rel, keep));
    else if (keep(rel)) out.push(rel);
  }
  return out;
}

const codeFiles = (dir: string): string[] => walk(dir, (f) => /\.(ts|tsx|mjs)$/.test(f));
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const countWord = (haystack: string, word: string): number =>
  [...haystack.matchAll(new RegExp(`(?<![\\w$-])${escapeRe(word)}(?![\\w$-])`, "g"))].length;

test("every exported const and function under src/ is used somewhere", () => {
  const everything = [...codeFiles("src"), ...codeFiles("scripts"), ...codeFiles("tests")]
    .map(text)
    .join("\n");
  const unused: string[] = [];
  for (const file of codeFiles("src")) {
    for (const m of text(file).matchAll(/^export\s+(?:const|function)\s+([A-Za-z_$][\w$]*)/gm)) {
      const name = m[1] ?? "";
      // One hit is the declaration itself.
      if (countWord(everything, name) < 2) unused.push(`${file}: ${name}`);
    }
  }
  assert.deepEqual(unused, []);
});

test("every key of the site facts object is read somewhere", () => {
  const everything = [...codeFiles("src"), ...codeFiles("scripts")]
    .filter((f) => f !== "src/content/site.ts")
    .map(text)
    .join("\n");
  const unused = Object.keys(site).filter((key) => countWord(everything, key) < 1);
  assert.deepEqual(unused, []);
});

test("every CSS class has at least one use in the source", () => {
  const css = walk("src/styles", (f) => f.endsWith(".css"))
    .map(text)
    .join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  // Keep selectors only, so lengths such as .5rem and url(...) are not read as classes.
  let selectors = css;
  for (let i = 0; i < 4; i += 1) selectors = selectors.replace(/\{[^{}]*\}/g, "{}");
  const classes = new Set([...selectors.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1] ?? ""));
  const source = walk("src", (f) => !f.endsWith(".css") && /\.(ts|tsx|html)$/.test(f))
    .concat(codeFiles("scripts"))
    .map(text)
    .join("\n");
  const unused = [...classes].filter((c) => !source.includes(c)).sort();
  assert.deepEqual(unused, []);
});

test("the removed /thanks/ page is gone from routes, page functions and the build", () => {
  assert.equal(
    routes.some((r) => r.path === "/thanks/"),
    false,
  );
  assert.doesNotMatch(text("src/content/pages.ts"), /export const thanks\b/);
  assert.doesNotMatch(text("scripts/build-pages.ts"), /\/thanks\//);
});

test("both forms post to site.formEndpoint, not a repeated literal", () => {
  const form = text("src/features/forms/MailForm.tsx");
  assert.doesNotMatch(form, /["'`]\/api\/message\.php["'`]/);
  assert.match(form, /site\.formEndpoint/);
});

test("the generated flag comment says what the flag does", () => {
  const routesSource = text("src/content/routes.ts");
  // /play/ is the only route with generated:false; the build skips it in the page loop.
  assert.match(routesSource, /\/\*\* False for [^*]*\/play\/[^*]*\*\//);
  assert.equal(routes.filter((r) => !r.generated).map((r) => r.path).join(), "/play/");
});
