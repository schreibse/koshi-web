/** Loads the Libro form's script, on its page only, so no other page pays for it. */
export function activarLibro(): void {
  const raiz = document.querySelector<HTMLElement>('ks-libro-de-reclamaciones');
  if (raiz) void import('./formulario').then((m) => m.activar(raiz));
}
