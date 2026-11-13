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

test("progress bar shows when budget is set with initial expenses", async ({
  page,
}) => {
  // Set budget to $3000
  const section = budgetSection(page);
  const input = section.getByLabel("Budget amount (USD)", { exact: true });
  const button = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await input.fill("3000");
  await button.click();

  // Progress bar should show with current month's expenses ($250)
  const progressBar = section.getByRole("region", {
    name: "Budget progress",
    exact: true,
  });
  await expect(progressBar).toBeVisible();
  await expect(progressBar).toContainText("$250.00 / $3000.00");
  await expect(progressBar).not.toContainText("OVER BUDGET");
});

test("progress bar shows 83% when $2500 spent against $3000 budget", async ({
  page,
}) => {
  // First set budget to $3000
  const section = budgetSection(page);
  const budgetInput = section.getByLabel("Budget amount (USD)", {
    exact: true,
  });
  const budgetButton = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await budgetInput.fill("3000");
  await budgetButton.click();

  // Add $2250 to bring total to $2500 (83% of $3000)
  const transactionForm = page
    .getByRole("region", { name: "Add Transaction", exact: true })
    .locator("form");
  await transactionForm
    .getByPlaceholder("Description", { exact: true })
    .fill("Large expense");
  await transactionForm
    .getByPlaceholder("Amount", { exact: true })
    .fill("2250");
  await transactionForm
    .getByRole("button", { name: "Add", exact: true })
    .click();

  // Progress bar should show 83% ($2500.00 / $3000.00)
  const progressBar = section.getByRole("region", {
    name: "Budget progress",
    exact: true,
  });
  await expect(progressBar).toContainText("$2500.00 / $3000.00");
  await expect(progressBar).not.toContainText("OVER BUDGET");
});

test("progress bar turns red with OVER BUDGET message when spending exceeds budget", async ({
  page,
}) => {
  // Set budget to $3000
  const section = budgetSection(page);
  const budgetInput = section.getByLabel("Budget amount (USD)", {
    exact: true,
  });
  const budgetButton = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await budgetInput.fill("3000");
  await budgetButton.click();

  // Add $2250 to bring total to $2500
  const transactionForm = page
    .getByRole("region", { name: "Add Transaction", exact: true })
    .locator("form");
  await transactionForm
    .getByPlaceholder("Description", { exact: true })
    .fill("First big expense");
  await transactionForm
    .getByPlaceholder("Amount", { exact: true })
    .fill("2250");
  await transactionForm
    .getByRole("button", { name: "Add", exact: true })
    .click();

  // Add $600 more to go over (total $3100, overage $100)
  await transactionForm
    .getByPlaceholder("Description", { exact: true })
    .fill("Second expense");
  await transactionForm.getByPlaceholder("Amount", { exact: true }).fill("600");
  await transactionForm
    .getByRole("button", { name: "Add", exact: true })
    .click();

  // Progress bar should show red and OVER BUDGET message (+$100.00)
  const progressBar = section.getByRole("region", {
    name: "Budget progress",
    exact: true,
  });
  await expect(progressBar).toContainText("OVER BUDGET: +$100.00");
  const progressElement = progressBar.locator("[role='progressbar']");
  await expect(progressElement).toHaveClass(/over-budget/);
});

test("table filters do not affect budget progress calculation", async ({
  page,
}) => {
  // Set budget to $3000
  const section = budgetSection(page);
  const budgetInput = section.getByLabel("Budget amount (USD)", {
    exact: true,
  });
  const budgetButton = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await budgetInput.fill("3000");
  await budgetButton.click();

  // Get initial progress text
  const progressBar = section.getByRole("region", {
    name: "Budget progress",
    exact: true,
  });
  const initialText = await progressBar.innerText();

  // Apply filter to show only income
  const transactionList = page.getByRole("region", {
    name: "Transactions",
    exact: true,
  });
  await transactionList
    .getByRole("combobox", { name: "Filter type", exact: true })
    .selectOption("income");

  // Progress should be unchanged
  const afterFilterText = await progressBar.innerText();
  await expect(afterFilterText).toBe(initialText);
});

test("changing budget recalculates progress bar instantly", async ({
  page,
}) => {
  // Set initial budget to $3000
  const section = budgetSection(page);
  const budgetInput = section.getByLabel("Budget amount (USD)", {
    exact: true,
  });
  const budgetButton = section.getByRole("button", {
    name: "Set Budget",
    exact: true,
  });

  await budgetInput.fill("3000");
  await budgetButton.click();

  const progressBar = section.getByRole("region", {
    name: "Budget progress",
    exact: true,
  });
  await expect(progressBar).toContainText("$250.00 / $3000.00");

  // Change budget to $100 (lower than current spending)
  await budgetInput.fill("100");
  await budgetButton.click();

  // Progress should update and show over budget ($250 - $100 = $150 overage)
  await expect(progressBar).toContainText("OVER BUDGET: +$150.00");
});
