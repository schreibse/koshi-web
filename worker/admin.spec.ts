import { describe, expect, it, vi } from 'vitest';
import { admin } from './admin';

const ORIGEN = 'https://koshisoftware.pe';

function entorno() {
  const put = vi.fn();
  const run = vi.fn();
  const env = {
    MEDIA: { put },
    BLOG: { prepare: () => ({ bind: () => ({ run }) }) },
  } as unknown as Env;
  return { env, put, run };
}

const pedir = (path: string, init: RequestInit = {}, env = entorno().env) =>
  admin(new Request(`${ORIGEN}/api/admin/${path}`, init), env);

describe('admin', () => {
  it('refuses a write from another origin', async () => {
    const res = await pedir('articulos', {
      method: 'POST',
      headers: { Origin: 'https://evil.example' },
    });
    expect(res.status).toBe(403);
  });

  it('refuses a write without an origin', async () => {
    const res = await pedir('articulos', { method: 'POST' });
    expect(res.status).toBe(403);
  });

  it('answers 404 for anything else', async () => {
    expect((await pedir('nada')).status).toBe(404);
  });

  describe('image upload', () => {
    const webp = new Uint8Array([
      ...new TextEncoder().encode('RIFF'),
      0,
      0,
      0,
      0,
      ...new TextEncoder().encode('WEBPVP8 '),
    ]);
    const subir = (query: string, body: BodyInit, env = entorno().env) =>
      pedir(
        `imagenes${query}`,
        { method: 'POST', headers: { Origin: ORIGEN }, body },
        env,
      );

    it('stores a WebP with its size', async () => {
      const { env, put, run } = entorno();

      const res = await subir('?ancho=1376&alto=900', webp, env);

      expect(res.status).toBe(201);
      const imagen = (await res.json()) as { id: string; src: string };
      expect(imagen).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{32}$/),
        src: `/media/${imagen.id}`,
        ancho: 1376,
        alto: 900,
      });
      expect(put).toHaveBeenCalledWith(imagen.id, webp, {
        httpMetadata: { contentType: 'image/webp' },
      });
      expect(run).toHaveBeenCalled();
    });

    it('refuses a file that is not an image', async () => {
      const res = await subir('?ancho=1&alto=1', '<svg onload=alert(1)>');
      expect(res.status).toBe(415);
    });

    it.each(['', '?ancho=0&alto=1', '?ancho=1.5&alto=1', '?ancho=1'])(
      'refuses the size %j',
      async (query) => {
        expect((await subir(query, webp)).status).toBe(400);
      },
    );
  });
});
