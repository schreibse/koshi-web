import { Mensaje, correoInterno, errores, normalizado } from './mensaje';

const valido: Mensaje = {
  nombre: 'Ana Quispe',
  email: 'ana@example.pe',
  tema: 'proyecto',
  mensaje: 'Quiero una web para mi panadería.',
};

describe('errores', () => {
  it('accepts a complete message', () => {
    expect(errores(valido)).toEqual([]);
  });

  it('names every missing or blank field', () => {
    expect(
      errores({ nombre: ' ', email: '', tema: 'proyecto', mensaje: '' }),
    ).toEqual(['nombre', 'email', 'mensaje']);
  });

  it('rejects a malformed email, an unknown topic and non-strings', () => {
    expect(errores({ ...valido, email: 'ana@' })).toEqual(['email']);
    expect(errores({ ...valido, tema: 'spam' as never })).toEqual(['tema']);
    expect(
      errores({ ...valido, nombre: 1, mensaje: null } as unknown as Mensaje),
    ).toEqual(['nombre', 'mensaje']);
  });

  it('caps the lengths', () => {
    expect(errores({ ...valido, nombre: 'a'.repeat(201) })).toEqual(['nombre']);
    expect(errores({ ...valido, mensaje: 'a'.repeat(4001) })).toEqual([
      'mensaje',
    ]);
  });
});

describe('normalizado', () => {
  it('trims and drops unknown fields', () => {
    const crafted = { ...valido, nombre: ' Ana ', extra: 'x' } as Mensaje;
    expect(normalizado(crafted)).toEqual({ ...valido, nombre: 'Ana' });
  });
});

describe('correoInterno', () => {
  it('puts topic and name in the subject, the sender under the text', () => {
    expect(correoInterno({ ...valido, tema: 'datos' })).toEqual({
      asunto: '[Contacto] Datos personales · Ana Quispe',
      texto:
        'Quiero una web para mi panadería.\n\n— Ana Quispe <ana@example.pe>',
    });
  });
});
