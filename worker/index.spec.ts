import { describe, expect, it } from 'vitest';
import worker from './index';

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

  it.each([
    ['POST', '/'],
    ['GET', '/api/contacto'],
    ['GET', '/api/reclamaciones'],
    ['POST', '/api/nada'],
  ])('leaves %s %s to the assets', async (method, path) => {
    expect(await fetchAt(path, { method })).toBe(asset);
  });
});
