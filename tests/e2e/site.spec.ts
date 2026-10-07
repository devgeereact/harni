import { test, expect } from "@playwright/test";
import { routes } from "../../src/content/routes";
import { books } from "../../src/data/books";

for (const width of [390, 1440]) {
  for (const route of routes) {
    test(`${width}: ${route.path} static content hydrates without page/console/image/overflow errors`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning")
          errors.push(message.text());
      });
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("#harni-root")).toHaveAttribute(
        "data-hydrated",
        "true",
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator("footer")
        .last()
        .scrollIntoViewIfNeeded()
        .catch(() => undefined);
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map((image) =>
            image.decode().catch(() => undefined),
          ),
        );
      });
      expect(
        await page.evaluate(() =>
          [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.getAttribute("src")),
        ),
      ).toEqual([]);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1,
        ),
      ).toBe(false);
      expect(
        await page
          .locator("a")
          .evaluateAll(
            (links) =>
              links.filter(
                (link) =>
                  !link.getAttribute("href") ||
                  link.getAttribute("href") === "#",
              ).length,
          ),
      ).toBe(0);
      if (route.indexable)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          `https://harni.uk${route.path}`,
        );
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `test-results/screens/${route.key}-${width}.png`,
        fullPage: true,
      });
      await info.attach("browser-errors", {
        body: JSON.stringify(errors),
        contentType: "application/json",
      });
      expect(errors).toEqual([]);
    });
  }
}

test("static book and contact content remain available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: baseURL!,
  });
  try {
    const page = await context.newPage();
    await page.goto("/books/");
    for (const book of books)
      expect(
        await page.locator(`a[href="/books/${book.slug}/"]`).count(),
      ).toBeGreaterThan(0);
    await page.goto("/contact/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.locator('a[href="mailto:info@harni.uk"]').first(),
    ).toBeVisible();
    await page.goto("/join/");
    await expect(
      page.locator('noscript a[href="mailto:subscribe@harni.uk"]'),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("React menu supports keyboard Escape and filtering toggles once", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/books/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  const chip = page.locator(".chip[data-group]").first();
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".is-dim").count()).toBeGreaterThan(0);
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".is-dim")).toHaveCount(0);
});

test("React mail form validates, preserves errors and submits JSON only to an intercepted endpoint", async ({
  page,
}) => {
  let calls = 0;
  let succeed = false;
  await page.route("**/api/message.php", async (route) => {
    calls++;
    expect(route.request().method()).toBe("POST");
    expect(route.request().url()).not.toContain("example.org");
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    expect(payload.kind).toBe("subscribe");
    expect(payload.consent).toBe(true);
    await route.fulfill({
      status: succeed ? 200 : 503,
      contentType: "application/json",
      body: JSON.stringify(
        succeed
          ? { ok: true, reference: "HM-TEST", copyAccepted: true }
          : { ok: false, message: "Fixture transport unavailable" },
      ),
    });
  });
  await page.goto("/join/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const form = page.locator("form[data-join-form]").first();
  await form.locator('button[type="submit"]').click();
  expect(calls).toBe(0);
  await form.locator('input[name="email"]').fill("reader@example.org");
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toHaveText(
    "Fixture transport unavailable",
  );
  await expect(form.locator('input[name="email"]')).toHaveValue(
    "reader@example.org",
  );
  succeed = true;
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toHaveText(
    "Thank you for joining my mailing list!",
  );
  await expect(form.locator('input[name="email"]')).toHaveValue("");
  expect(calls).toBe(2);
});

test("Pier Run starts and pauses through its React-owned lifecycle island", async ({
  page,
}) => {
  await page.goto("/play/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await page.locator("[data-game-action]").click();
  await expect(page.locator("[data-pause-game]")).toBeEnabled();
  await page.locator("[data-pause-game]").click();
  await expect(page.locator("[data-pause-game]")).toContainText("Resume");
});
