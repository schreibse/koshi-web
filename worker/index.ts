import { redireccion } from 'angular-server';
import { withTrailingSlash } from '@koshi/shared/locale/util';
import { autorizado } from './acceso';
import { admin } from './admin';
import { paginaBlog, sitemapBlog } from './blog';
import { enviarMensaje } from './contacto';
import { imagen } from './media';
import { registrarHoja } from './reclamaciones';
import { rootRedirect } from './root-redirect';

// Only the paths in wrangler.toml's `run_worker_first` reach this; files are served without it.
export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const { method } = request;
    if (pathname === '/' && (method === 'GET' || method === 'HEAD')) {
      return rootRedirect(request);
    }
    if (pathname === '/api/reclamaciones' && method === 'POST') {
      return registrarHoja(request, env, ctx);
    }
    if (pathname === '/api/contacto' && method === 'POST') {
      return enviarMensaje(request, env);
    }
    if (/^\/(api\/)?admin(\/|$)/.test(pathname)) {
      if (!(await autorizado(request, env))) {
        return new Response('Forbidden', { status: 403 });
      }
      if (pathname.startsWith('/api/')) return admin(request, env);
    }
    const lectura = method === 'GET' || method === 'HEAD';
    if (lectura) {
      const respuesta =
        (await imagen(request, env)) ??
        (await sitemapBlog(request, env)) ??
        (await paginaBlog(request, env));
      if (respuesta) return respuesta;
    }
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404 || !lectura) return asset;
    const redirect = await redireccion(request);
    return redirect ? conBarra(redirect) : asset;
  },
} satisfies ExportedHandler<Env>;

/** Angular redirects to the unslashed path; sending the slashed one saves a second hop. */
function conBarra(redirect: Response): Response {
  const location = redirect.headers.get('Location');
  if (!location) return redirect;
  return new Response(null, {
    status: redirect.status,
    headers: { Location: withTrailingSlash(location) },
  });
}
