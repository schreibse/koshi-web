import { validar } from './validar';

const IMAGEN = '/media/0123456789abcdef0123456789abcdef';

describe('validar', () => {
  it('accepts every block and inline node a post may contain', () => {
    expect(
      validar(
        [
          '## Dos',
          '### Tres',
          'Un **fuerte**, _suave_, `código`, [enlace](https://x.pe) y [otro](/es/).  ',
          'salto',
          '- a\n- **b**',
          '1. uno\n2. dos',
          '```ts\nconst x = 1;\n```',
          '> Una cita\n>\n> ## con título',
          `![Un gato](${IMAGEN})`,
        ].join('\n\n'),
      ),
    ).toEqual([]);
  });

  it.each([
    ['# Uno', 'Only ## and ### headings are allowed: # Uno'],
    ['#### Cuatro', 'Only ## and ### headings are allowed: #### Cuatro'],
    ['---', 'Not allowed (hr): ---'],
    ['<div>x</div>', 'Not allowed (html): <div>x</div>'],
    ['| a |\n| - |\n| b |', 'Not allowed (table): | a | | - | | b |'],
    ['Hola <br>', 'Not allowed (html): <br>'],
    ['~~no~~', 'Not allowed (del): ~~no~~'],
    [
      '[a](javascript:alert(1))',
      'Links must be https:// or a path on this site: [a](javascript:alert(1))',
    ],
    [
      '[a](//x.pe)',
      'Links must be https:// or a path on this site: [a](//x.pe)',
    ],
    [
      '![a](https://x.pe/a.png)',
      'Images must be uploaded ones (/media/…): ![a](https://x.pe/a.png)',
    ],
    [
      `Mira ![a](${IMAGEN})`,
      `An image needs a paragraph of its own: ![a](${IMAGEN})`,
    ],
    ['- a\n  - b', 'Only text is allowed in a list item: - b'],
    ['- [ ] tarea', 'Task lists are not allowed: - [ ] tarea'],
    ['> <div>x</div>', 'Not allowed (html): <div>x</div>'],
  ])('rejects %j', (markdown, mensaje) => {
    expect(validar(markdown)).toEqual([mensaje]);
  });

  it('shortens long quotes', () => {
    const [mensaje] = validar(`# ${'a'.repeat(100)}`);
    expect(mensaje).toMatch(/: # a{55}…$/);
  });
});
