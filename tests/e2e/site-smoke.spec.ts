import { expect, test } from '@playwright/test';

test('English storefront and product discovery remain usable', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle(/Reach Projector/i);
  await expect(page.getByRole('link', { name: /products/i }).first()).toBeVisible();

  await page.goto('/en/products');
  await expect(page.locator('h1').filter({ hasText: /^Products$/ })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/(?:Footer|products)\.[a-z][\w.]+/);

  const firstProduct = page.locator('a[href*="/en/products/"]').first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('main img, body img').first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: /checkout now|request.*quote|send inquiry/i }).first()
  ).toBeVisible();
});

test('business inquiry path remains reachable', async ({ page }) => {
  await page.goto('/en/wholesale');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('form').first()).toBeVisible();
});

test('checkout rejects an incomplete direct visit safely', async ({ page }) => {
  await page.goto('/en/checkout');
  await expect(page.locator('body')).not.toContainText(/Internal Server Error|Application error/i);
});
