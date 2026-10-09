import {
  HojaDeReclamacion,
  MAX_TEXTO,
  errores,
  normalizada,
  numeroDeHoja,
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
            documento: 'RUC' as never,
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
});
