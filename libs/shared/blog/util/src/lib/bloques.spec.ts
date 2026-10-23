import { aBloques } from './bloques';

describe('aBloques', () => {
  it('maps headings, paragraphs and inline formatting', () => {
    expect(
      aBloques(
        '# Uno\n\n### Tres\n\nHola **fuerte** y _suave_, `x < y` & más.',
      ),
    ).toEqual([
      { tipo: 'titulo', nivel: 2, hijos: [{ tipo: 'texto', texto: 'Uno' }] },
      { tipo: 'titulo', nivel: 3, hijos: [{ tipo: 'texto', texto: 'Tres' }] },
      {
        tipo: 'parrafo',
        hijos: [
          { tipo: 'texto', texto: 'Hola ' },
          { tipo: 'negrita', hijos: [{ tipo: 'texto', texto: 'fuerte' }] },
          { tipo: 'texto', texto: ' y ' },
          { tipo: 'cursiva', hijos: [{ tipo: 'texto', texto: 'suave' }] },
          { tipo: 'texto', texto: ', ' },
          { tipo: 'codigo', texto: 'x < y' },
          { tipo: 'texto', texto: ' & más.' },
        ],
      },
    ]);
  });

  it('keeps https and site links, and turns other schemes into text', () => {
    expect(
      aBloques(
        '[a](https://x.pe) [b](/es/) [c](javascript:alert(1)) [d](//x.pe)',
      ),
    ).toEqual([
      {
        tipo: 'parrafo',
        hijos: [
          {
            tipo: 'enlace',
            href: 'https://x.pe',
            hijos: [{ tipo: 'texto', texto: 'a' }],
          },
          { tipo: 'texto', texto: ' ' },
          {
            tipo: 'enlace',
            href: '/es/',
            hijos: [{ tipo: 'texto', texto: 'b' }],
          },
          { tipo: 'texto', texto: ' ' },
          { tipo: 'texto', texto: '[c](javascript:alert(1))' },
          { tipo: 'texto', texto: ' ' },
          { tipo: 'texto', texto: '[d](//x.pe)' },
        ],
      },
    ]);
  });

  it('turns a paragraph holding only an image into an image block', () => {
    expect(aBloques('![Un gato](/img/gato.png)')).toEqual([
      { tipo: 'imagen', src: '/img/gato.png', alt: 'Un gato' },
    ]);
  });

  it('maps lists, code blocks and quotes', () => {
    expect(
      aBloques(
        '1. uno\n2. **dos**\n\n```ts title\nconst a = 1;\n```\n\n> cita',
      ),
    ).toEqual([
      {
        tipo: 'lista',
        ordenada: true,
        items: [
          [{ tipo: 'texto', texto: 'uno' }],
          [{ tipo: 'negrita', hijos: [{ tipo: 'texto', texto: 'dos' }] }],
        ],
      },
      { tipo: 'codigo', lenguaje: 'ts', texto: 'const a = 1;' },
      {
        tipo: 'cita',
        hijos: [{ tipo: 'parrafo', hijos: [{ tipo: 'texto', texto: 'cita' }] }],
      },
    ]);
  });

  it('shows raw HTML as text instead of markup', () => {
    expect(aBloques('<script>alert(1)</script>')).toEqual([
      {
        tipo: 'parrafo',
        hijos: [{ tipo: 'texto', texto: '<script>alert(1)</script>' }],
      },
    ]);
  });
});
