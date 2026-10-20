import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const origin = 'https://koshisoftware.pe';

const locales = [
  {
    path: '/es/',
    lang: 'es',
    heading: 'Software koshi, hecho en Perú.',
    switchTo: { label: 'EN', path: '/en/', lang: 'en' },
    themeToggle: 'Cambiar tema claro/oscuro',
    title: 'Koshisoftware · Desarrollo Angular y NestJS en Perú',
    description: /^Koshisoftware desarrolla aplicaciones web/,
  },
  {
    path: '/en/',
    lang: 'en',
    heading: 'Koshi software, built in Peru.',
    switchTo: { label: 'ES', path: '/es/', lang: 'es' },
    themeToggle: 'Toggle light/dark theme',
    title: 'Koshisoftware · Angular and NestJS development in Peru',
    description: /^Koshisoftware builds web applications/,
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

    for (const javaScriptEnabled of [false, true]) {
      test.describe(`head with JavaScript ${javaScriptEnabled ? 'on' : 'off'}`, () => {
        test.use({ javaScriptEnabled });

        test('carries title, description and hreflang links', async ({
          page,
        }) => {
          await page.goto(locale.path);
          await expect(page).toHaveTitle(locale.title);
          await expect(
            page.locator('meta[name="description"]'),
          ).toHaveAttribute('content', locale.description);
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            `${origin}${locale.path}`,
          );
          const alternates = page.locator('link[rel="alternate"][hreflang]');
          await expect(alternates).toHaveCount(3);
          for (const [hreflang, path] of [
            ['es', '/es/'],
            ['en', '/en/'],
            ['x-default', '/'],
          ]) {
            await expect(
              page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
            ).toHaveAttribute('href', `${origin}${path}`);
          }
        });
      });
    }

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

const localizedPages = [
  {
    path: '/es/empresas',
    lang: 'es',
    heading: 'Tu web en español e inglés, lista para vender',
    title: 'Webs para empresas en Perú · Koshisoftware',
    switchTo: { label: 'EN', path: '/en/business', lang: 'en' },
    alternates: { es: '/es/empresas/', en: '/en/business/' },
  },
  {
    path: '/en/business',
    lang: 'en',
    heading: 'Your website in Spanish and English, ready to sell',
    title: 'Websites for businesses in Peru · Koshisoftware',
    switchTo: { label: 'ES', path: '/es/empresas', lang: 'es' },
    alternates: { es: '/es/empresas/', en: '/en/business/' },
  },
  ...(['es', 'en'] as const).map((lang) => ({
    path:
      lang === 'es'
        ? '/es/proyectos/koshisoftware'
        : '/en/projects/koshisoftware',
    lang,
    heading: 'koshisoftware.pe',
    title:
      lang === 'es'
        ? 'Caso de estudio: koshisoftware.pe · Koshisoftware'
        : 'Case study: koshisoftware.pe · Koshisoftware',
    switchTo:
      lang === 'es'
        ? { label: 'EN', path: '/en/projects/koshisoftware', lang: 'en' }
        : { label: 'ES', path: '/es/proyectos/koshisoftware', lang: 'es' },
    alternates: {
      es: '/es/proyectos/koshisoftware/',
      en: '/en/projects/koshisoftware/',
    },
  })),
  ...(['es', 'en'] as const).map((lang) => ({
    path:
      lang === 'es'
        ? '/es/proyectos/libro-de-reclamaciones'
        : '/en/projects/libro-de-reclamaciones',
    lang,
    heading:
      lang === 'es'
        ? 'Libro de Reclamaciones virtual'
        : 'Online Libro de Reclamaciones',
    title:
      lang === 'es'
        ? 'Caso de estudio: Libro de Reclamaciones virtual · Koshisoftware'
        : 'Case study: online Libro de Reclamaciones · Koshisoftware',
    switchTo:
      lang === 'es'
        ? {
            label: 'EN',
            path: '/en/projects/libro-de-reclamaciones',
            lang: 'en',
          }
        : {
            label: 'ES',
            path: '/es/proyectos/libro-de-reclamaciones',
            lang: 'es',
          },
    alternates: {
      es: '/es/proyectos/libro-de-reclamaciones/',
      en: '/en/projects/libro-de-reclamaciones/',
    },
  })),
] as const;

for (const page of localizedPages) {
  test.describe(`${page.path}`, () => {
    test('renders in its language', async ({ page: tab }) => {
      await tab.goto(page.path);
      await expect(tab.locator('html')).toHaveAttribute('lang', page.lang);
      await expect(
        tab.getByRole('heading', { level: 1, name: page.heading }),
      ).toBeVisible();
    });

    for (const javaScriptEnabled of [false, true]) {
      test.describe(`head with JavaScript ${javaScriptEnabled ? 'on' : 'off'}`, () => {
        test.use({ javaScriptEnabled });

        test('links each locale to its own slug', async ({ page: tab }) => {
          await tab.goto(page.path);
          await expect(tab).toHaveTitle(page.title);
          await expect(tab.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            `${origin}${page.path}/`,
          );
          for (const [hreflang, path] of Object.entries(page.alternates)) {
            await expect(
              tab.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
            ).toHaveAttribute('href', `${origin}${path}`);
          }
        });
      });
    }

    test('language switch lands on the translated slug', async ({
      page: tab,
    }) => {
      await tab.goto(page.path);
      await tab
        .getByRole('link', { name: page.switchTo.label, exact: true })
        .click();
      // Cloudflare drops the trailing slash; a local static server may add one.
      await expect(tab).toHaveURL(new RegExp(`${page.switchTo.path}/?$`));
      await expect(tab.locator('html')).toHaveAttribute(
        'lang',
        page.switchTo.lang,
      );
    });

    for (const theme of ['dark', 'light'] as const) {
      test(`has no accessibility violations in ${theme}`, async ({
        page: tab,
      }) => {
        await tab.addInitScript(
          (stored) => localStorage.setItem('theme', stored),
          theme,
        );
        await tab.goto(page.path);
        const { violations } = await new AxeBuilder({ page: tab })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(violations).toEqual([]);
      });
    }
  });
}

for (const { home, caso } of [
  { home: '/es/', caso: /\/es\/proyectos\/koshisoftware\/?$/ },
  { home: '/en/', caso: /\/en\/projects\/koshisoftware\/?$/ },
]) {
  test(`${home} links its project to the case study`, async ({ page }) => {
    await page.goto(home);
    await page
      .locator('#proyectos')
      .getByRole('link', { name: /koshisoftware\.pe/ })
      .click();
    await expect(page).toHaveURL(caso);
  });
}

test('a slug of the other locale redirects to this one', async ({ page }) => {
  await page.goto('/en/empresas');
  await expect(page).toHaveURL(/\/en\/business\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const { lang, heading, home } of [
  { lang: 'es', heading: 'Página no encontrada', home: 'inicio/' },
  { lang: 'en', heading: 'Page not found', home: 'home/' },
] as const) {
  test(`404 page in ${lang} offers the way home and stays out of search`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/404.html`);
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await page.getByRole('link', { name: home, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/$`));
  });
}
