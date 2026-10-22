import { enviarMensaje } from './contacto';
import { registrarHoja } from './reclamaciones';
import { rootRedirect } from './root-redirect';

// Only the paths in wrangler.toml's `run_worker_first` reach this; every other request is a static asset.
export default {
  fetch(request, env, ctx) {
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
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
