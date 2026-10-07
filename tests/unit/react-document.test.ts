import { test } from "node:test";
import assert from "node:assert/strict";
import {
  contentTree,
  reactDocument,
} from "../../scripts/lib/react-document.ts";
test("repository content cannot introduce executable handlers, URLs or scripts, including no-JavaScript fallbacks", () => {
  for (const html of [
    '<img onerror="alert(1)">',
    '<a href="javascript:alert(1)">bad</a>',
    "<script>alert(1)</script>",
    '<noscript><img onerror="alert(1)"></noscript>',
  ])
    assert.throws(() => contentTree(html), /Executable/);
});
test("static React output preserves readable content and a script-safe inert hydration payload", () => {
  const html = reactDocument(
    '<html><head></head><body><h1>Author &amp; books</h1><p>&lt;/script&gt; is ordinary public text.</p><noscript><a href="mailto:reader@example.org">Email</a></noscript></body></html>',
  );
  assert.match(html, /<h1>Author &amp; books<\/h1>/);
  assert.match(
    html.replace(/<!--.*?-->/g, ""),
    /<noscript><a href="mailto:reader@example.org">Email<\/a><\/noscript>/,
  );
  const payload =
    /<script id="harni-page" type="application\/json">([\s\S]*?)<\/script>/.exec(
      html,
    )?.[1];
  assert.ok(payload);
  assert.equal(payload.includes("<"), false);
  assert.doesNotThrow(() => JSON.parse(payload));
});

// Regression: Cloudflare exclusions inside raw noscript HTML must also be in the
// client payload, otherwise React warns during development hydration.
test("no-JavaScript email fallback matches the client hydration payload exactly", () => {
  const html = reactDocument(
    '<html><body><noscript><a href="mailto:reader@example.org">Email</a></noscript></body></html>',
  );
  const raw = /<noscript>([\s\S]*?)<\/noscript>/.exec(html)?.[1];
  const payload =
    /<script id="harni-page" type="application\/json">([\s\S]*?)<\/script>/.exec(
      html,
    )?.[1];
  assert.ok(payload);
  const tree = JSON.parse(payload);
  assert.equal(tree[0].children.join(""), raw);
  assert.match(raw ?? "", /<!--email_off-->/);
});
