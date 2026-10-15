import { copiaDeHoja } from './correo';
import { HojaDeReclamacion } from './hoja';

const hoja: HojaDeReclamacion = {
  consumidor: {
    nombre: 'Ana Quispe',
    domicilio: 'Av. Lima 123, Lima',
    telefono: '999 888 777',
    email: 'ana@ejemplo.pe',
    documento: 'DNI',
    numeroDocumento: '12345678',
  },
  apoderado: null,
  servicio: 'Desarrollo de aplicación web',
  monto: 1500,
  tipo: 'queja',
  detalle: '<b>Llegó</b> tarde.',
  pedido: 'Un descuento.',
};

describe('copiaDeHoja', () => {
  it('carries the sheet, the provider and the legal notices in Spanish', () => {
    const { asunto, texto } = copiaDeHoja(
      hoja,
      '000000007-2026',
      '2026-10-09T20:42:00Z',
      'es',
    );

    expect(asunto).toBe('Hoja de reclamación 000000007-2026 · Koshisoftware');
    expect(texto).toContain('Hoja n.º: 000000007-2026');
    expect(texto).toContain('Fecha: 09/10/2026, 15:42');
    expect(texto).toContain('Tipo: Queja');
    expect(texto).toContain('RUC 20612884201');
    expect(texto).toContain('DNI 12345678');
    expect(texto).toContain('Monto reclamado: S/ 1500.00');
    expect(texto).toContain('15 días hábiles');
    expect(texto).toContain('INDECOPI');
    expect(texto).not.toContain('Apoderado');
  });

  it('keeps what the consumer wrote as plain text', () => {
    expect(
      copiaDeHoja(hoja, '000000007-2026', '2026-10-09T20:42:00Z', 'es').texto,
    ).toContain('Detalle:\n<b>Llegó</b> tarde.');
  });

  it('adds the guardian when there is one', () => {
    const { texto } = copiaDeHoja(
      {
        ...hoja,
        apoderado: {
          nombre: 'Rosa Quispe',
          domicilio: 'Av. Lima 123',
          telefono: '999 111 222',
          email: 'rosa@ejemplo.pe',
        },
      },
      '000000007-2026',
      '2026-10-09T20:42:00Z',
      'es',
    );

    expect(texto).toContain('Apoderado:\nRosa Quispe');
  });

  it('writes the English copy for the English site', () => {
    const { asunto, texto } = copiaDeHoja(
      hoja,
      '000000007-2026',
      '2026-10-09T20:42:00Z',
      'en',
    );

    expect(asunto).toBe('Complaint sheet 000000007-2026 · Koshisoftware');
    expect(texto).toContain('Type: Queja (complaint)');
    expect(texto).toContain('15 business days');
  });
});
