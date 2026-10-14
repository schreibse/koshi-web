import {
  Documento,
  HojaDeReclamacion,
  Tipo,
  errores,
} from '@koshi/shared/reclamacion/util';
import { verificacion } from './verificacion';

type Error = 'required' | 'email' | 'documento' | 'invalid';

const MENSAJE: Record<Error, string> = {
  required: 'errorRequired',
  email: 'errorEmail',
  documento: 'errorDocumento',
  invalid: 'errorInvalid',
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

/** Makes the prerendered Libro form under `raiz` validate, submit and show its receipt. */
export function activar(raiz: HTMLElement): void {
  const form = pieza<HTMLFormElement>(raiz, 'form');
  const apoderado = pieza<HTMLElement>(form, '[data-apoderado]');
  const fallo = pieza<HTMLElement>(form, '[data-fallo]');
  const enviar = pieza<HTMLButtonElement>(form, 'button[type=submit]');
  const turnstile = verificacion(
    pieza<HTMLElement>(form, '[data-verificacion]'),
  );
  const tocados = new Set<string>();
  let enviado = false;

  const control = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement;
  const valor = (name: string) => control(name).value;
  const marcado = (name: string) => control(name).checked;

  const leer = (): HojaDeReclamacion => {
    const contacto = (prefijo: string) => ({
      nombre: valor(`${prefijo}.nombre`),
      domicilio: valor(`${prefijo}.domicilio`),
      telefono: valor(`${prefijo}.telefono`),
      email: valor(`${prefijo}.email`),
    });
    return {
      consumidor: {
        ...contacto('consumidor'),
        documento: valor('consumidor.documento') as Documento,
        numeroDocumento: valor('consumidor.numeroDocumento'),
      },
      apoderado: marcado('menor') ? contacto('apoderado') : null,
      servicio: valor('servicio'),
      monto: valor('monto') === '' ? NaN : Number(valor('monto')),
      tipo: valor('tipo') as Tipo,
      detalle: valor('detalle'),
      pedido: valor('pedido'),
    };
  };

  const fallos = (): Map<string, Error> => {
    const out = new Map<string, Error>();
    for (const name of errores(leer())) {
      out.set(
        name,
        !valor(name).trim()
          ? 'required'
          : name.endsWith('.email')
            ? 'email'
            : name.endsWith('.numeroDocumento')
              ? 'documento'
              : 'invalid',
      );
    }
    if (!marcado('conforme')) out.set('conforme', 'required');
    return out;
  };

  const pintar = () => {
    const actuales = fallos();
    for (const campo of form.querySelectorAll('ks-campo')) {
      const input = pieza<HTMLInputElement>(campo, '[name]');
      const error =
        enviado || tocados.has(input.name) ? actuales.get(input.name) : null;
      const p = pieza<HTMLElement>(campo, '[data-error]');
      p.textContent = error ? (form.dataset[MENSAJE[error]] ?? '') : '';
      p.hidden = !error;
      if (error) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
    return actuales;
  };

  const avisar = (motivo: 'falloVerificacion' | 'falloEnvio' | null) =>
    (fallo.textContent = motivo ? (form.dataset[motivo] ?? '') : '');

  form.addEventListener('focusout', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (name) tocados.add(name);
    pintar();
  });
  form.addEventListener('input', pintar);
  form.addEventListener('change', () => {
    apoderado.hidden = !marcado('menor');
    pintar();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enviar.disabled) return;
    enviado = true;
    avisar(null);
    if (pintar().size) return;
    const token = turnstile.token();
    if (!token) {
      avisar('falloVerificacion');
      return;
    }
    const hoja = leer();
    enviar.disabled = true;
    const respuesta = await fetch('/api/reclamaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Language': document.documentElement.lang,
        'X-Turnstile-Token': token,
      },
      body: JSON.stringify(hoja),
    }).catch(() => null);
    enviar.disabled = false;
    if (!respuesta?.ok) {
      turnstile.reset();
      avisar(respuesta?.status === 403 ? 'falloVerificacion' : 'falloEnvio');
      return;
    }
    const { numero, registrada } = await respuesta.json();
    mostrarRecibo(raiz, hoja, numero, registrada);
  });
}

function mostrarRecibo(
  raiz: HTMLElement,
  hoja: HojaDeReclamacion,
  numero: string,
  registrada: string,
): void {
  const { consumidor } = hoja;
  const campos: Record<string, string> = {
    numero,
    email: consumidor.email,
    fecha: FECHA.format(new Date(registrada)),
    tipo: hoja.tipo,
    consumidor: `${consumidor.nombre} · ${consumidor.documento} ${consumidor.numeroDocumento}`,
    apoderado: hoja.apoderado?.nombre ?? '',
    servicio: hoja.servicio,
    monto: `S/ ${hoja.monto.toFixed(2)}`,
    detalle: hoja.detalle,
    pedido: hoja.pedido,
  };
  const recibo = pieza<HTMLElement>(raiz, '[data-recibo]');
  for (const el of recibo.querySelectorAll<HTMLElement>('[data-campo]')) {
    el.textContent = campos[el.dataset['campo'] ?? ''] ?? '';
  }
  for (const el of recibo.querySelectorAll<HTMLElement>(
    '[data-con-apoderado]',
  )) {
    el.hidden = !hoja.apoderado;
  }
  pieza(recibo, '[data-imprimir]').addEventListener('click', () => print());
  pieza<HTMLElement>(raiz, '[data-formulario]').hidden = true;
  recibo.hidden = false;
  pieza<HTMLElement>(recibo, 'h1').focus();
}

/** The prerendered markup is the contract with this script; a missing piece is a bug, not a state. */
function pieza<T extends Element>(raiz: ParentNode, selector: string): T {
  const elemento = raiz.querySelector<T>(selector);
  if (!elemento) throw new Error(`Libro: falta ${selector}`);
  return elemento;
}
