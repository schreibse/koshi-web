export const TIPOS = ['reclamo', 'queja'] as const;
export type Tipo = (typeof TIPOS)[number];

export const DOCUMENTOS = ['DNI', 'CE', 'Pasaporte'] as const;
export type Documento = (typeof DOCUMENTOS)[number];

export interface Contacto {
  nombre: string;
  domicilio: string;
  telefono: string;
  email: string;
}

/** What a consumer files: the fields of Anexo I of the Reglamento del Libro de Reclamaciones. */
export interface HojaDeReclamacion {
  consumidor: Contacto & { documento: Documento; numeroDocumento: string };
  /** Parent or guardian, when the consumer is a minor. */
  apoderado: Contacto | null;
  servicio: string;
  monto: number;
  tipo: Tipo;
  detalle: string;
  pedido: string;
}

export const MAX_TEXTO = 4000;
const MAX_LINEA = 200;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function errores(hoja: HojaDeReclamacion): string[] {
  const out: string[] = [];
  const linea = (path: string, value: unknown, required = true) => {
    if (typeof value !== 'string') out.push(path);
    else if (required && !value.trim()) out.push(path);
    else if (value.length > MAX_LINEA) out.push(path);
  };
  const contacto = (path: string, c: Contacto | null | undefined) => {
    if (!c || typeof c !== 'object') return out.push(path);
    linea(`${path}.nombre`, c.nombre);
    linea(`${path}.domicilio`, c.domicilio);
    linea(`${path}.telefono`, c.telefono);
    linea(`${path}.email`, c.email);
    if (typeof c.email === 'string' && !EMAIL.test(c.email)) {
      out.push(`${path}.email`);
    }
    return;
  };

  contacto('consumidor', hoja.consumidor);
  if (!DOCUMENTOS.includes(hoja.consumidor?.documento)) {
    out.push('consumidor.documento');
  }
  linea('consumidor.numeroDocumento', hoja.consumidor?.numeroDocumento);
  if (hoja.apoderado !== null) contacto('apoderado', hoja.apoderado);
  linea('servicio', hoja.servicio);
  if (
    typeof hoja.monto !== 'number' ||
    !Number.isFinite(hoja.monto) ||
    hoja.monto < 0
  ) {
    out.push('monto');
  }
  if (!TIPOS.includes(hoja.tipo)) out.push('tipo');
  for (const key of ['detalle', 'pedido'] as const) {
    const value = hoja[key];
    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.length > MAX_TEXTO
    ) {
      out.push(key);
    }
  }
  return out;
}

/** Copies only the known fields, so a crafted request cannot store anything else. */
export function normalizada(hoja: HojaDeReclamacion): HojaDeReclamacion {
  const contacto = (c: Contacto): Contacto => ({
    nombre: c.nombre.trim(),
    domicilio: c.domicilio.trim(),
    telefono: c.telefono.trim(),
    email: c.email.trim(),
  });
  return {
    consumidor: {
      ...contacto(hoja.consumidor),
      documento: hoja.consumidor.documento,
      numeroDocumento: hoja.consumidor.numeroDocumento.trim(),
    },
    apoderado: hoja.apoderado && contacto(hoja.apoderado),
    servicio: hoja.servicio.trim(),
    monto: hoja.monto,
    tipo: hoja.tipo,
    detalle: hoja.detalle.trim(),
    pedido: hoja.pedido.trim(),
  };
}

/** The correlative number as Anexo I prints it: `000000001-2026`. */
export function numeroDeHoja(secuencia: number, anio: number): string {
  return `${String(secuencia).padStart(9, '0')}-${anio}`;
}
