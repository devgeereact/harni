import { test, expect } from "@playwright/test";
test("contact prevents duplicate requests and preserves text after an ambiguous network failure", async ({
  page,
}) => {
  let calls = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/message.php", async (route) => {
    calls++;
    const payload = route.request().postDataJSON();
    expect(payload.kind).toBe("contact");
    expect(payload.acknowledgement).toBe(true);
    expect(payload.message).toBe("Synthetic contact fixture");
    await held;
    await route.abort("failed");
  });
  await page.goto("/contact/");
  await expect(page.locator("#harni-root")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const form = page.locator("form[data-contact-form]");
  await form.locator('[name="name"]').fill("Local Test");
  await form.locator('[name="email"]').fill("local@example.org");
  await form.locator('[name="message"]').fill("Synthetic contact fixture");
  await form.locator('[name="acknowledgement"]').check();
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[type="submit"]')).toBeDisabled();
  await form.evaluate((element) => {
    (element as HTMLFormElement).requestSubmit();
  });
  expect(calls).toBe(1);
  release();
  await expect(form.locator("[data-form-status]")).toContainText(
    "could not confirm",
  );
  await expect(form.locator('[name="message"]')).toHaveValue(
    "Synthetic contact fixture",
  );
  await expect(form.locator('[type="submit"]')).toBeEnabled();
  expect(calls).toBe(1);
});
