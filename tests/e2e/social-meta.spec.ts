import { test, expect } from "@playwright/test";
import { routes } from "../../src/content/routes";
import { books } from "../../src/data/books";

// KNOWN-ISSUES rows 11 and 26: every built page has a share card, and llms.txt is served.
for (const route of routes.filter((r) => r.path !== "/404.html")) {
  test(`${route.path} has og:title, an absolute https og:image and og:url equal to canonical`, async ({ request }) => {
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const meta = (attr: string, name: string): string | undefined =>
      new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`).exec(html)?.[1];
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    expect(canonical).toBe(`https://harni.uk${route.path}`);
    expect(meta("property", "og:url")).toBe(canonical);
    expect(meta("property", "og:title")?.length ?? 0).toBeGreaterThan(0);
    expect(meta("property", "og:image")).toMatch(/^https:\/\/harni\.uk\/.+\.jpg$/);
    expect(meta("name", "twitter:card")).toBeTruthy();
    const imagePath = new URL(meta("property", "og:image") ?? "").pathname;
    expect((await request.get(imagePath)).status()).toBe(200);
  });
}

test("llms.txt is served as text and lists all the books", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain/);
  const text = await response.text();
  expect(text.startsWith("# Harni Muharami")).toBe(true);
  for (const book of books) expect(text).toContain(`https://harni.uk/books/${book.slug}/`);
});
