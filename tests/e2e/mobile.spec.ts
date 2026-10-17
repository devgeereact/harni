import { test, expect, devices } from "@playwright/test";
import { routes } from "../../src/content/routes";

// Phone emulation (iPhone 13 size, touch on). It is not a real-device test.
const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices["iPhone 13"];
test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

for (const route of routes) {
  test(`${route.path} fits a phone screen without sideways scrolling`, async ({ page }) => {
    await page.goto(route.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("Pier Run shows touch help and starts from a tap on a phone", async ({ page }) => {
  await page.goto("/play/");
  await expect(page.locator("#harni-root")).toHaveAttribute("data-hydrated", "true");
  await expect(page.locator(".game__hint-touch")).toBeVisible();
  await page.locator("[data-game-action]").tap();
  await expect(page.locator("[data-pause-game]")).toBeEnabled();
});
