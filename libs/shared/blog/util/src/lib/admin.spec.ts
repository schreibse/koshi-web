import { problemas, type Texto } from './admin';

const texto = (cambios: Partial<Texto> = {}): Texto => ({
  slug: 'hola-mundo',
  titulo: 'Hola',
  descripcion: 'Una nota.',
  cuerpo: '## Uno\n\nTexto.',
  ...cambios,
});

describe('problemas', () => {
  it('lets a draft be saved in one language', () => {
    expect(problemas({ en: texto() }, false)).toEqual([]);
  });

  it('asks a published post for both languages', () => {
    expect(problemas({ en: texto() }, true)).toEqual([
      { locale: 'es', mensaje: 'A published post needs this language.' },
    ]);
  });

  it('checks slug, required fields and the body', () => {
    expect(
      problemas(
        {
          es: texto({ slug: 'Hola--x', titulo: ' ', cuerpo: '# Uno' }),
        },
        false,
      ),
    ).toEqual([
      {
        locale: 'es',
        campo: 'slug',
        mensaje: 'Lowercase letters, digits and single hyphens only.',
      },
      { locale: 'es', campo: 'titulo', mensaje: 'Required.' },
      {
        locale: 'es',
        campo: 'cuerpo',
        mensaje: 'Only ## and ### headings are allowed: # Uno',
      },
    ]);
  });
});
