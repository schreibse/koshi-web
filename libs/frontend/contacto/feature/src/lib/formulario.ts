import { verificacion } from '@koshi/frontend/layout/ui';
import { Mensaje, TEMAS, Tema, errores } from '@koshi/shared/contacto/util';

type Error = 'required' | 'email' | 'invalid';

const MENSAJE: Record<Error, string> = {
  required: 'errorRequired',
  email: 'errorEmail',
  invalid: 'errorInvalid',
};

/** Makes the prerendered contact form under `raiz` validate, preset its topic from `?tema=` and submit. */
export function activar(raiz: HTMLElement): void {
  const form = pieza<HTMLFormElement>(raiz, 'form');
  const avisoDatos = pieza<HTMLElement>(form, '[data-aviso-datos]');
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

  const preset = new URLSearchParams(location.search).get('tema');
  if (TEMAS.includes(preset as Tema)) control('tema').value = preset as Tema;
  const mostrarAviso = () => (avisoDatos.hidden = valor('tema') !== 'datos');
  mostrarAviso();

  const leer = (): Mensaje => ({
    nombre: valor('nombre'),
    email: valor('email'),
    tema: valor('tema') as Tema,
    mensaje: valor('mensaje'),
  });

  const fallos = (): Map<string, Error> =>
    new Map(
      errores(leer()).map((name) => [
        name,
        !valor(name).trim()
          ? 'required'
          : name === 'email'
            ? 'email'
            : 'invalid',
      ]),
    );

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
  form.addEventListener('change', mostrarAviso);

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
    const mensaje = leer();
    enviar.disabled = true;
    const respuesta = await fetch('/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Turnstile-Token': token,
      },
      body: JSON.stringify(mensaje),
    }).catch(() => null);
    enviar.disabled = false;
    if (!respuesta?.ok) {
      turnstile.reset();
      avisar(respuesta?.status === 403 ? 'falloVerificacion' : 'falloEnvio');
      return;
    }
    const listo = pieza<HTMLElement>(raiz, '[data-enviado]');
    pieza<HTMLElement>(listo, '[data-campo="email"]').textContent =
      mensaje.email.trim();
    pieza<HTMLElement>(raiz, '[data-formulario]').hidden = true;
    listo.hidden = false;
    pieza<HTMLElement>(listo, 'h1').focus();
  });
}

/** The prerendered markup is the contract with this script; a missing piece is a bug, not a state. */
function pieza<T extends Element>(raiz: ParentNode, selector: string): T {
  const elemento = raiz.querySelector<T>(selector);
  if (!elemento) throw new Error(`Contacto: falta ${selector}`);
  return elemento;
}
