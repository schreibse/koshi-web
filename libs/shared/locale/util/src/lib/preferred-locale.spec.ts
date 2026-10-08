import { preferredLocale } from './preferred-locale';

describe('preferredLocale', () => {
  it.each([
    [null, 'en'],
    ['', 'en'],
    ['*', 'en'],
    ['de-DE,de;q=0.9', 'en'],
    ['es-PE,es;q=0.9,en;q=0.8', 'es'],
    ['en-US,en;q=0.9,es;q=0.8', 'en'],
    ['de-DE,es;q=0.5,en;q=0.3', 'es'],
    ['fr;q=0.9,en;q=0.2,es;q=0.7', 'es'],
    ['es;q=0,en', 'en'],
    ['ES-pe', 'es'],
    ['pt-BR, es-419;q=0.6', 'es'],
  ])('%j → %s', (header, expected) => {
    expect(preferredLocale(header)).toBe(expected);
  });
});
