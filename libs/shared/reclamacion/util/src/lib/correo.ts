import { HojaDeReclamacion } from './hoja';

export type Idioma = 'es' | 'en';

export interface Correo {
  asunto: string;
  texto: string;
}

const PROVEEDOR = [
  'KOSHISOFTWARE E.I.R.L.',
  'RUC 20612884201',
  'MZA. J2 LOTE. 7 DPTO. 301 OTR. MALECÓN SUPERIOR LIMA - LIMA - PUNTA HERMOSA',
];

const TEXTOS = {
  es: {
    asunto: 'Hoja de reclamación',
    saludo: 'Hola',
    intro:
      'Registramos tu hoja en el Libro de Reclamaciones. Esta es tu copia.',
    numero: 'Hoja n.º',
    fecha: 'Fecha',
    proveedor: 'Proveedor',
    consumidor: 'Consumidor',
    apoderado: 'Apoderado',
    servicio: 'Servicio',
    monto: 'Monto reclamado',
    tipo: 'Tipo',
    tipos: { reclamo: 'Reclamo', queja: 'Queja' },
    detalle: 'Detalle',
    pedido: 'Pedido',
    plazo: 'Te responderemos por correo en un plazo máximo de 15 días hábiles.',
    otrasVias:
      'La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.',
  },
  en: {
    asunto: 'Complaint sheet',
    saludo: 'Hello',
    intro:
      'We registered your sheet in the Libro de Reclamaciones. This is your copy.',
    numero: 'Sheet no.',
    fecha: 'Date',
    proveedor: 'Provider',
    consumidor: 'Consumer',
    apoderado: 'Guardian',
    servicio: 'Service',
    monto: 'Amount claimed',
    tipo: 'Type',
    tipos: { reclamo: 'Reclamo (claim)', queja: 'Queja (complaint)' },
    detalle: 'Detail',
    pedido: 'Request',
    plazo: 'We will reply by email within 15 business days at most.',
    otrasVias:
      'Filing a claim does not prevent you from using other ways of resolving the dispute, and is not a prerequisite for reporting to INDECOPI.',
  },
};

const FECHA = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Lima',
});

/** The consumer's copy of a filed sheet, as plain text: what they wrote is never rendered as HTML. */
export function copiaDeHoja(
  hoja: HojaDeReclamacion,
  numero: string,
  registrada: string,
  idioma: Idioma,
): Correo {
  const t = TEXTOS[idioma];
  const { consumidor, apoderado } = hoja;
  const campo = (etiqueta: string, valor: string) => `${etiqueta}: ${valor}`;
  const bloque = (etiqueta: string, valor: string) => `${etiqueta}:\n${valor}`;
  return {
    asunto: `${t.asunto} ${numero} · Koshisoftware`,
    texto: [
      `${t.saludo} ${consumidor.nombre}:`,
      t.intro,
      [
        campo(t.numero, numero),
        campo(t.fecha, FECHA.format(new Date(registrada))),
        campo(t.tipo, t.tipos[hoja.tipo]),
      ].join('\n'),
      bloque(t.proveedor, PROVEEDOR.join('\n')),
      bloque(
        t.consumidor,
        [
          consumidor.nombre,
          `${consumidor.documento} ${consumidor.numeroDocumento}`,
          consumidor.domicilio,
          consumidor.telefono,
          consumidor.email,
        ].join('\n'),
      ),
      ...(apoderado
        ? [
            bloque(
              t.apoderado,
              [
                apoderado.nombre,
                apoderado.domicilio,
                apoderado.telefono,
                apoderado.email,
              ].join('\n'),
            ),
          ]
        : []),
      [
        campo(t.servicio, hoja.servicio),
        campo(t.monto, `S/ ${hoja.monto.toFixed(2)}`),
      ].join('\n'),
      bloque(t.detalle, hoja.detalle),
      bloque(t.pedido, hoja.pedido),
      t.plazo,
      t.otrasVias,
    ].join('\n\n'),
  };
}
