import { localizedUrl, slug, toLocale } from './localized-path';

describe('slug', () => {
  it('gives each locale its own path', () => {
    expect(slug('empresas', 'es')).toBe('empresas');
    expect(slug('empresas', 'en')).toBe('business');
  });
});

describe('toLocale', () => {
  it.each([
    ['es', 'es'],
    ['es-PE', 'es'],
    ['en', 'en'],
    ['en-US', 'en'],
  ])('%s → %s', (id, locale) => {
    expect(toLocale(id)).toBe(locale);
  });
});

describe('localizedUrl', () => {
  it.each([
    ['/empresas', 'es', 'en', '/business'],
    ['/business', 'en', 'es', '/empresas'],
    ['/empresas#incluye', 'es', 'en', '/business#incluye'],
    ['/empresas?ref=x', 'es', 'en', '/business?ref=x'],
    ['/', 'es', 'en', '/'],
    ['/#contacto', 'es', 'en', '/#contacto'],
    [
      '/libro-de-reclamaciones/hoja',
      'es',
      'en',
      '/libro-de-reclamaciones/hoja',
    ],
  ] as const)('%s (%s → %s) is %s', (url, from, to, expected) => {
    expect(localizedUrl(url, from, to)).toBe(expected);
  });

  it('leaves a slug of the other locale alone, as it is no page in this one', () => {
    expect(localizedUrl('/business', 'es', 'en')).toBe('/business');
  });
});
