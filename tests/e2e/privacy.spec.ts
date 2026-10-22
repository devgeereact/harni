import { test, expect, type Page } from "@playwright/test";
import { routes } from "../../src/content/routes";

// Runtime evidence for the Privacy and Cookies pages: on a clean visit no page contacts another
// host, sets a cookie or writes browser storage. Pier Run stores its score only after opt-in.
const SCORE_KEY = "harni.pier-run.best";

async function browserState(page: Page) {
  return page.evaluate(async () => {
    const databases =
      "databases" in indexedDB ? await indexedDB.databases() : [];
    return {
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
      documentCookie: document.cookie,
      indexedDb: databases.map((database) => database.name),
    };
  });
}

for (const route of routes) {
  test(`${route.path} makes no third-party request and stores nothing on a clean visit`, async ({
    page,
    context,
    baseURL,
  }) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:5162").origin;
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.protocol === "data:" || url.protocol === "blob:") return;
      if (url.origin !== origin) foreign.push(request.url());
    });
    await page.goto(route.path);
    await expect(page.locator("#harni-root")).toHaveAttribute(
      "data-hydrated",
      "true",
    );
    await page.waitForLoadState("networkidle");
    expect(foreign).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(await browserState(page)).toEqual({
      local: [],
      session: [],
      documentCookie: "",
      indexedDb: [],
    });
  });
}

test("every page links to the Privacy, Cookies and Terms pages, and each one loads", async ({
  page,
  request,
}) => {
  for (const legal of ["/privacy/", "/cookies/", "/terms/"]) {
    expect((await request.get(legal)).status()).toBe(200);
  }
  for (const route of routes) {
    await page.goto(route.path);
    for (const legal of ["/privacy/", "/cookies/", "/terms/"]) {
      await expect(
        page.locator(`footer a[href="${legal}"]`),
        `${route.path} footer links to ${legal}`,
      ).toHaveCount(1);
    }
  }
});

test("Pier Run keeps the score in memory until the visitor opts in, and removal works", async ({
  page,
}) => {
  await page.goto("/play/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const box = page.locator("[data-save-score]");
  const status = page.locator("[data-storage-status]");
  await page.locator(".unwind-settings summary").click();
  await expect(box).not.toBeChecked();
  await page.locator("[data-game-action]").click();
  await page.locator("[data-pause-game]").click();
  expect((await browserState(page)).local).toEqual([]);

  await box.check();
  await expect(status).toContainText("Score saving is on");
  expect((await browserState(page)).local).toEqual([SCORE_KEY]);

  await box.uncheck();
  await expect(status).toContainText("saved score has been removed");
  expect((await browserState(page)).local).toEqual([]);

  await box.check();
  await page.locator("[data-delete-score]").click();
  await expect(box).not.toBeChecked();
  await expect(status).toContainText("Saved score deleted");
  expect((await browserState(page)).local).toEqual([]);
});

test("a score saved on an earlier visit is not read or changed until the visitor opts in again", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem(key, "4321");
      sessionStorage.setItem("seeded", "1");
    }
  }, SCORE_KEY);
  await page.goto("/play/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await expect(page.locator("[data-save-score]")).not.toBeChecked();
  await expect(page.locator("body")).not.toContainText("4321");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), SCORE_KEY),
  ).toBe("4321");
});
