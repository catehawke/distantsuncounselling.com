// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has page meta info', async ({ page }) => {
    await expect(page).toHaveTitle(/Distant Sun Counselling/);
    await expect(page.locator('css=html')).toHaveAttribute('lang', 'en');
  });

  test('has the font stylesheet', async ({ page }) => {
    await expect(
      page.locator('css=link[rel="stylesheet"]').first()
    ).toHaveAttribute('href', /^https:\/\/fonts.googleapis.com\/css\?(.*)/);
  });

  test('has header logo', async ({ page }) => {
    await expect(
      page.getByRole('img', { name: 'Distant Sun Counselling' })
    ).toBeVisible();
  });

  test('has main content', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Hello/ })
    ).toBeVisible();

    await expect(page.getByRole('main')).toContainText(
      'My name is Cate Hawke and I’m a relational integrative counsellor'
    );
  });

  test('has contacts in footer', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /@distantsuncounselling.com/ })
    ).toHaveAttribute('href', /^mailto:(.*)@distantsuncounselling.com$/);

    await expect(page.getByRole('link', { name: /\+44/ })).toHaveAttribute(
      'href',
      /^tel:\+44[\s\d]*$/
    );
  });
});
