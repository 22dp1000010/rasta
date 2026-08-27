import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("citizen journey works with model network blocked", async ({ page }) => {
  await page.route("**/api.groq.com/**", (route) => route.abort());
  await page.route("**/api.openai.com/**", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Fight the wrong fine/i })).toBeVisible();
  await page.getByRole("link", { name: /TS09XX4477/i }).click();
  await expect(page.getByRole("heading", { name: /Meera Raghavan/i })).toBeVisible();
  await page.getByRole("link", { name: /Open/i }).first().click();
  await page.getByRole("button", { name: /Classify my case/i }).click();
  await expect(page.getByText(/Classified by rules/i)).toBeVisible();
  await page.getByRole("button", { name: /Continue to evidence/i }).click();
  await expect(page.getByText(/Days left to act/i)).toBeVisible();
  await page.getByRole("link", { name: /Draft dispute/i }).click();
  await expect(page.getByLabel(/Draft text/i)).toContainText("Request to review");
  await page.getByRole("link", { name: /I filed this in demo/i }).click();
  await page.getByRole("link", { name: /Simulate upheld/i }).click();
  await expect(page.getByRole("heading", { name: /Streak restored/i })).toBeVisible();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations).toEqual([]);
});
