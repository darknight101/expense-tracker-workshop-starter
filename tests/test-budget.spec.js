import { test, expect } from "@playwright/test";

const budgetSection = (page) =>
  page.getByRole("region", { name: "Budget", exact: true });

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2027-01-15T12:00:00Z") });
  await page.goto("/");
});

test('budget section shows "No budget set" initially', async ({ page }) => {
  const section = budgetSection(page);
  await expect(section).toBeVisible();
  await expect(section.getByText("No budget set for this month")).toBeVisible();
});

test("entering valid budget displays it and clears the form", async ({
  page,
}) => {
  const section = budgetSection(page);
  const input = section.getByLabel("Budget amount (USD)", { exact: true });
  const button = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await input.fill("3000");
  await button.click();

  await expect(section.getByText("Budget: $3000.00")).toBeVisible();
  await expect(input).toHaveValue("");
});

test("budget form rejects zero and negative values", async ({ page }) => {
  const section = budgetSection(page);
  const input = section.getByLabel("Budget amount (USD)", { exact: true });
  const button = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  for (const value of ["0", "-100"]) {
    await input.fill(value);
    await button.click();
    await expect(section.getByRole("alert")).toBeVisible();
  }
});

test("budget persists after setting", async ({ page }) => {
  const section = budgetSection(page);
  const input = section.getByLabel("Budget amount (USD)", { exact: true });
  const button = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await input.fill("5000");
  await button.click();

  await expect(section.getByText("Budget: $5000.00")).toBeVisible();
});

test("budget resets on page reload", async ({ page }) => {
  const section = budgetSection(page);
  const input = section.getByLabel("Budget amount (USD)", { exact: true });
  const button = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await input.fill("2500");
  await button.click();
  await expect(section.getByText("Budget: $2500.00")).toBeVisible();

  await page.reload();

  await expect(section.getByText("No budget set for this month")).toBeVisible();
});
