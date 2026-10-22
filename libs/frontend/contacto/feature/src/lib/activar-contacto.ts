/** Loads the contact form's script, on its page only, so no other page pays for it. */
export function activarContacto(): void {
  const raiz = document.querySelector<HTMLElement>('ks-contacto');
  if (raiz) void import('./formulario').then((m) => m.activar(raiz));
}
