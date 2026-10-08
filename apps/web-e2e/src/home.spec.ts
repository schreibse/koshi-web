import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const locales = [
  {
    path: '/es/',
    lang: 'es',
    heading: 'Software fuerte, hecho en Perú.',
    switchTo: { label: 'EN', path: '/en/', lang: 'en' },
    themeToggle: 'Cambiar tema claro/oscuro',
  },
  {
    path: '/en/',
    lang: 'en',
    heading: 'Strong software, built in Peru.',
    switchTo: { label: 'ES', path: '/es/', lang: 'es' },
    themeToggle: 'Toggle light/dark theme',
  },
] as const;

for (const locale of locales) {
  test.describe(`${locale.path}`, () => {
    test('renders in its language', async ({ page }) => {
      await page.goto(locale.path);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
      await expect(
        page.getByRole('heading', { level: 1, name: locale.heading }),
      ).toBeVisible();
    });

    test('language switch keeps the page', async ({ page }) => {
      await page.goto(locale.path);
      await page
        .getByRole('link', { name: locale.switchTo.label, exact: true })
        .click();
      await expect(page).toHaveURL(locale.switchTo.path);
      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        locale.switchTo.lang,
      );
    });

    test('theme choice survives a reload and a language switch', async ({
      page,
    }) => {
      const html = page.locator('html');
      await page.goto(locale.path);
      await page.getByRole('button', { name: locale.themeToggle }).click();
      await expect(html).toHaveAttribute('data-theme', 'light');

      await page.reload();
      await expect(html).toHaveAttribute('data-theme', 'light');

      await page.goto(locale.switchTo.path);
      await expect(html).toHaveAttribute('data-theme', 'light');
    });

    for (const theme of ['dark', 'light'] as const) {
      test(`has no accessibility violations in ${theme}`, async ({ page }) => {
        await page.addInitScript(
          (stored) => localStorage.setItem('theme', stored),
          theme,
        );
        await page.goto(locale.path);
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(violations).toEqual([]);
      });
    }
  });
}
