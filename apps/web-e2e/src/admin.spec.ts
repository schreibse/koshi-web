import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { crc32, deflateSync } from 'node:zlib';
import { tokenAcceso } from './acceso';

const sufijo = Date.now().toString(36);
const slugs = { en: `e2e-cats-${sufijo}`, es: `e2e-gatos-${sufijo}` };

test.describe('without an Access token', () => {
  for (const path of ['/admin/', '/api/admin/articulos']) {
    test(`${path} is forbidden`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(403);
    });
  }
});

test.describe('with an Access token', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ context }) => {
    await context.setExtraHTTPHeaders({
      'Cf-Access-Jwt-Assertion': await tokenAcceso(),
    });
  });

  test('a write from another origin is refused', async ({ request }) => {
    const res = await request.post('/api/admin/articulos', {
      headers: { Origin: 'https://evil.example' },
    });
    expect(res.status()).toBe(403);
  });

  test('a post is written, published in both languages and unpublished', async ({
    page,
    request,
  }) => {
    await page.goto('/admin/');
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

    await page.getByRole('button', { name: 'New post' }).click();
    await expect(page).toHaveURL(/\?articulo=\d+$/);

    await escribir(page, {
      titulo: 'Cats',
      slug: slugs.en,
      descripcion: 'About cats.',
      cuerpo: '# Too big',
    });
    await expect(
      page.getByText('Only ## and ### headings are allowed: # Too big'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled();
    await page.getByLabel('Body (Markdown)').fill('## Cats\n\nThey **sleep**.');
    await expect(page.getByLabel('Preview').locator('strong')).toHaveText(
      'sleep',
    );

    await page.getByLabel('Add image').setInputFiles({
      name: 'cat.png',
      mimeType: 'image/png',
      buffer: png(2000, 1000),
    });
    await expect(page.getByRole('status')).toHaveText(
      'Image added; describe it between the brackets.',
    );
    const cuerpo = page.getByLabel('Body (Markdown)');
    const conImagen = await cuerpo.inputValue();
    expect(conImagen).toMatch(/!\[\]\(\/media\/[0-9a-f]{32}\)/);
    const id = conImagen.split('/media/')[1].slice(0, 32);
    await expect(page.getByText(/^Images need alt text/)).toBeVisible();
    await cuerpo.fill(conImagen.replace('![]', '![A sleeping cat]'));

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status')).toHaveText('Saved.');
    await expect(page.getByRole('button', { name: 'Publish' })).toBeDisabled();

    await page.getByRole('tab', { name: /Español/ }).click();
    await escribir(page, {
      titulo: 'Gatos',
      slug: slugs.es,
      descripcion: 'Sobre gatos.',
      cuerpo: '## Gatos\n\nDuermen.',
    });
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status')).toHaveText('Saved.');
    await page.getByRole('button', { name: 'Publish' }).click();
    await expect(page.getByRole('status')).toHaveText('Published.');

    const imagen = await request.get(`/media/${id}`);
    expect(imagen.status()).toBe(200);
    expect(imagen.headers()['content-type']).toBe('image/webp');
    expect(imagen.headers()['cache-control']).toContain('immutable');

    const publico = await page.context().newPage();
    await publico.goto(`/en/blog/${slugs.en}/`);
    await expect(
      publico.getByRole('heading', { level: 1, name: 'Cats' }),
    ).toBeVisible();
    const img = publico.getByRole('img', { name: 'A sleeping cat' });
    await expect(img).toHaveAttribute('width', '1376');
    await expect(img).toHaveAttribute('height', '688');
    await expect(
      publico.locator('link[rel="alternate"][hreflang="es"]'),
    ).toHaveAttribute('href', new RegExp(`/es/blog/${slugs.es}/$`));
    await publico.getByRole('link', { name: 'Español', exact: true }).click();
    await expect(
      publico.getByRole('heading', { level: 1, name: 'Gatos' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Unpublish' }).click();
    await expect(page.getByRole('status')).toHaveText('Unpublished.');
    expect((await request.get(`/en/blog/${slugs.en}/`)).status()).toBe(404);
  });
});

async function escribir(
  page: Page,
  texto: { titulo: string; slug: string; descripcion: string; cuerpo: string },
) {
  await page.getByLabel('Title').fill(texto.titulo);
  await page.getByLabel('Slug').fill(texto.slug);
  await page.getByLabel(/^Description/).fill(texto.descripcion);
  await page.getByLabel('Body (Markdown)').fill(texto.cuerpo);
}

/** A solid grey PNG of the given size, built by hand so the test needs no fixture file. */
function png(ancho: number, alto: number): Buffer {
  const fila = Buffer.concat([Buffer.from([0]), Buffer.alloc(ancho, 0x80)]);
  const pixeles = deflateSync(Buffer.concat(Array(alto).fill(fila)));
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(ancho, 0);
  cabecera.writeUInt32BE(alto, 4);
  cabecera.set([8, 0, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', cabecera),
    trozo('IDAT', pixeles),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

function trozo(tipo: string, datos: Buffer): Buffer {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const suma = Buffer.alloc(4);
  suma.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, suma]);
}
