import { describe, expect, it, vi } from 'vitest';
import worker from './index';

vi.mock('angular-server', () => ({
  renderizar: async () => null,
  redireccion: async (request: Request) =>
    new URL(request.url).pathname === '/en/empresas/'
      ? Response.redirect('https://koshisoftware.pe/en/business', 302)
      : null,
}));

const asset = new Response('asset');
const env = { ASSETS: { fetch: async () => asset } } as unknown as Env;
const ctx = { waitUntil: () => undefined } as unknown as ExecutionContext;

const fetchAt = (path: string, init?: RequestInit) =>
  worker.fetch(
    new Request(`https://koshisoftware.pe${path}`, init) as Request<
      unknown,
      IncomingRequestCfProperties
    >,
    env,
    ctx,
  );

describe('worker', () => {
  it('redirects the root by Accept-Language', async () => {
    const res = await fetchAt('/', { headers: { 'Accept-Language': 'en-US' } });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://koshisoftware.pe/en/');
  });

  it('redirects a HEAD on the root too', async () => {
    const res = await fetchAt('/', { method: 'HEAD' });
    expect(res.status).toBe(302);
  });

  it('files a sheet on POST, validating it first', async () => {
    const res = await fetchAt('/api/reclamaciones', {
      method: 'POST',
      body: '{}',
    });
    expect(res.status).toBe(422);
  });

  it('sends a contact message on POST, validating it first', async () => {
    const res = await fetchAt('/api/contacto', { method: 'POST', body: '{}' });
    expect(res.status).toBe(422);
  });

  it.each(['/admin/', '/admin', '/api/admin/articulos'])(
    'keeps %s behind Access',
    async (path) => {
      const res = await fetchAt(path);
      expect(res.status).toBe(403);
    },
  );

  it('sends the blog to its slashed URL', async () => {
    const res = await fetchAt('/es/blog');
    expect(res.status).toBe(307);
  });

  it.each([
    ['POST', '/'],
    ['GET', '/api/contacto'],
    ['GET', '/api/reclamaciones'],
    ['POST', '/api/nada'],
    ['POST', '/es/blog/'],
  ])('leaves %s %s to the assets', async (method, path) => {
    expect(await fetchAt(path, { method })).toBe(asset);
  });

  describe('when no file matches', () => {
    const notFound = new Response('404 page', { status: 404 });
    const missing = {
      ASSETS: { fetch: async () => notFound },
    } as unknown as Env;
    const fetchMissing = (path: string, init?: RequestInit) =>
      worker.fetch(
        new Request(`https://koshisoftware.pe${path}`, init) as Request<
          unknown,
          IncomingRequestCfProperties
        >,
        missing,
        ctx,
      );

    it("redirects another locale's slug, straight to the slashed URL", async () => {
      const res = await fetchMissing('/en/empresas/');
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe(
        'https://koshisoftware.pe/en/business/',
      );
    });

    it('serves the 404 page for anything else', async () => {
      expect(await fetchMissing('/es/nada/')).toBe(notFound);
      expect(await fetchMissing('/en/empresas/', { method: 'POST' })).toBe(
        notFound,
      );
    });
  });
});
