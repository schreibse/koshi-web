import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import type { ContextoBlog } from '@koshi/shared/blog/util';

const app = new AngularAppEngine();

/** Renders a server-rendered route for the Worker, which has already loaded its data. */
export async function renderizar(
  request: Request,
  contexto: ContextoBlog,
): Promise<Response | null> {
  return app.handle(request, contexto);
}

/** The redirect the app's routes define for this URL, such as another locale's slug. */
export async function redireccion(request: Request): Promise<Response | null> {
  const response = await app.handle(request);
  return response && response.status >= 300 && response.status < 400
    ? response
    : null;
}

// The Angular dev server looks for this export.
export const reqHandler = createRequestHandler(
  async (request) =>
    (await app.handle(request)) ?? new Response(null, { status: 404 }),
);
