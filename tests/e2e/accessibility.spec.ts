import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes } from "../../src/content/routes";

// Automated WCAG 2.2 AA scan of every built page. It does not replace a screen reader pass.
for (const route of routes) {
  test(`${route.path} has no automatically detectable WCAG A or AA violations`, async ({ page }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
    expect(summary).toEqual([]);
  });
}
