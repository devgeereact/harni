import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

// The cPanel host lists a folder's files when it has no index page (seen live on /assets/ and
// /images/ on 1 Nov 2026). The root .htaccess is not ours to ship, so every built folder without
// an index page must carry its own `Options -Indexes`, which also covers its sub-folders.
const dist = fileURLToPath(new URL("../../dist/", import.meta.url));

function folders(dir: string): string[] {
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isDirectory())
    .flatMap((path) => [path, ...folders(path)]);
}

const blocksListing = (dir: string): boolean => {
  const file = join(dir, ".htaccess");
  return existsSync(file) && /^\s*Options\s+[^\n]*-Indexes/m.test(readFileSync(file, "utf8"));
};

test("every built folder without an index page refuses directory listing", () => {
  const exposed = folders(dist)
    .filter((dir) => !existsSync(join(dir, "index.html")))
    .filter((dir) => {
      // A parent folder's -Indexes covers its children.
      for (let up = dir; up.startsWith(dist) && up !== dist.replace(/\/$/, ""); up = join(up, "..")) {
        if (blocksListing(up)) return false;
      }
      return true;
    })
    .map((dir) => relative(dist, dir));
  expect(exposed).toEqual([]);
});

test("the build ships no root .htaccess (the host owns it)", () => {
  expect(existsSync(join(dist, ".htaccess"))).toBe(false);
});
