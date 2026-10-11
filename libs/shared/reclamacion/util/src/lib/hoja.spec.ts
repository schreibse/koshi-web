import {
  HojaDeReclamacion,
  MAX_TEXTO,
  errores,
  normalizada,
  numeroDeHoja,
  numeroDocumentoValido,
} from './hoja';

const contacto = {
  nombre: 'Ana Quispe',
  domicilio: 'Av. Lima 123, Lima',
  telefono: '999 888 777',
  email: 'ana@ejemplo.pe',
};

const hoja = (patch: Partial<HojaDeReclamacion> = {}): HojaDeReclamacion => ({
  consumidor: { ...contacto, documento: 'DNI', numeroDocumento: '12345678' },
  apoderado: null,
  servicio: 'Desarrollo de aplicación web',
  monto: 1500,
  tipo: 'reclamo',
  detalle: 'La entrega llegó tarde.',
  pedido: 'Un descuento.',
  ...patch,
});

describe('errores', () => {
  it('accepts a complete sheet', () => {
    expect(errores(hoja())).toEqual([]);
  });

  it('names every missing or malformed field', () => {
    expect(
      errores(
        hoja({
          consumidor: {
            ...contacto,
            email: 'no-es-correo',
            documento: 'Licencia' as never,
            numeroDocumento: ' ',
          },
          monto: -1,
          tipo: 'otro' as never,
          detalle: '',
        }),
      ),
    ).toEqual([
      'consumidor.email',
      'consumidor.documento',
      'consumidor.numeroDocumento',
      'monto',
      'tipo',
      'detalle',
    ]);
  });

  it('checks the guardian only for a minor', () => {
    expect(errores(hoja({ apoderado: { ...contacto, nombre: '' } }))).toEqual([
      'apoderado.nombre',
    ]);
  });

  it('accepts a zero amount, as a queja has none', () => {
    expect(errores(hoja({ tipo: 'queja', monto: 0 }))).toEqual([]);
  });

  it('rejects text over the limit', () => {
    expect(errores(hoja({ pedido: 'x'.repeat(MAX_TEXTO + 1) }))).toEqual([
      'pedido',
    ]);
  });
});

describe('numeroDocumentoValido', () => {
  it.each([
    ['DNI', '12345678'],
    ['DNI', '12 345 678'],
    ['RUC', '20123456789'],
    ['CE', '001234567'],
    ['Pasaporte', 'ab-123456'],
    ['CPP/PTP', 'CPP1234567890AB'],
    ['Otro', 'X123456789012345'.slice(0, 15)],
  ] as const)('accepts %s %s', (documento, numero) => {
    expect(numeroDocumentoValido(documento, numero)).toBe(true);
  });

  it.each([
    ['DNI', '1234567'],
    ['DNI', '12345678-9'],
    ['RUC', '2012345678'],
    ['CE', '1234567890123'],
    ['Pasaporte', 'AB.123'],
    ['Otro', ''],
  ] as const)('rejects %s %s', (documento, numero) => {
    expect(numeroDocumentoValido(documento, numero)).toBe(false);
  });
});

describe('numeroDeHoja', () => {
  it('pads to nine digits and appends the year', () => {
    expect(numeroDeHoja(7, 2026)).toBe('000000007-2026');
  });
});

describe('normalizada', () => {
  it('drops unknown fields and trims the text', () => {
    const crafted = {
      ...hoja({ detalle: '  Tarde.  ' }),
      extra: '<script>',
    } as HojaDeReclamacion;
    (crafted.consumidor as unknown as Record<string, unknown>)['rol'] = 'admin';

    expect(normalizada(crafted)).toEqual(hoja({ detalle: 'Tarde.' }));
  });

  it('stores the document number without spaces or hyphens, in capitals', () => {
    const consumidor = {
      ...hoja().consumidor,
      documento: 'Pasaporte' as const,
    };
    expect(
      normalizada(
        hoja({ consumidor: { ...consumidor, numeroDocumento: ' ab-12 34 ' } }),
      ).consumidor.numeroDocumento,
    ).toBe('AB1234');
  });
});
