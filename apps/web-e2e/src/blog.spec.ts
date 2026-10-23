import { expect, test } from '@playwright/test';

// The e2e server keeps its own local D1, which holds no posts: the blog as it ships.
for (const { lang, heading, empty } of [
  {
    lang: 'es',
    heading: 'Notas de mi trabajo',
    empty: 'Todavía no hay artículos.',
  },
  { lang: 'en', heading: 'Notes from my work', empty: 'No posts yet.' },
] as const) {
  test(`empty blog index in ${lang} stays out of search`, async ({ page }) => {
    await page.goto(`/${lang}/blog`);

    await expect(page).toHaveURL(new RegExp(`/${lang}/blog/$`));
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
    await expect(page.getByText(empty)).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex',
    );
  });
}

test('an unknown post is a 404', async ({ page }) => {
  const response = await page.goto('/es/blog/nada/');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Página no encontrada' }),
  ).toBeVisible();
});

test('the sitemap index points crawlers at the pages and the blog', async ({
  request,
}) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap: https://koshisoftware.pe/sitemap.xml');

  const indice = await (await request.get('/sitemap.xml')).text();
  expect(
    [...indice.matchAll(/<loc>(.+?)<\/loc>/g)].map(([, loc]) => loc),
  ).toEqual([
    'https://koshisoftware.pe/sitemap-paginas.xml',
    'https://koshisoftware.pe/blog/sitemap',
  ]);

  const paginas = await (await request.get('/sitemap-paginas.xml')).text();
  expect(paginas).toContain('<loc>https://koshisoftware.pe/es/</loc>');

  const blog = await request.get('/blog/sitemap');
  expect(blog.headers()['content-type']).toBe('application/xml; charset=utf-8');
  expect(await blog.text()).not.toContain('<url>');
});
