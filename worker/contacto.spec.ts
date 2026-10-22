import { afterEach, describe, expect, it, vi } from 'vitest';
import { enviarMensaje } from './contacto';

const env = { TURNSTILE_SECRET: 's', SWEEGO_API_KEY: 'k' } as Env;
const mensaje = {
  nombre: 'Ana Quispe',
  email: 'ana@example.pe',
  tema: 'cv',
  mensaje: 'Hola',
};

const post = (body: unknown, token: string | null = 't') =>
  enviarMensaje(
    new Request('https://koshisoftware.pe/api/contacto', {
      method: 'POST',
      headers: token ? { 'X-Turnstile-Token': token } : {},
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    env,
  );

const servicios = ({ humano = true, sweego = true } = {}) => {
  const fetch = vi.fn(async (url: string) =>
    url.includes('turnstile')
      ? Response.json({ success: humano })
      : sweego
        ? Response.json({ transaction_id: 'tx' })
        : new Response('down', { status: 500 }),
  );
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

afterEach(() => vi.unstubAllGlobals());

describe('enviarMensaje', () => {
  it('rejects malformed JSON and invalid messages without spending the token', async () => {
    const fetch = servicios();
    expect((await post('nope')).status).toBe(400);
    const res = await post({ ...mensaje, email: 'x' });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ errores: ['email'] });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refuses without a passing Turnstile token', async () => {
    servicios({ humano: false });
    expect((await post(mensaje)).status).toBe(403);
    expect((await post(mensaje, null)).status).toBe(403);
  });

  it('mails our inbox only, with the sender as reply-to', async () => {
    const fetch = servicios();
    expect((await post(mensaje)).status).toBe(204);
    const [, init] = fetch.mock.calls[1] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.recipients).toEqual([
      { email: 'hola@koshisoftware.pe', name: 'Koshisoftware' },
    ]);
    expect(body['reply-to']).toEqual({
      email: 'ana@example.pe',
      name: 'Ana Quispe',
    });
    expect(body.subject).toBe('[Contacto] CV · Ana Quispe');
  });

  it('tells the sender when the mail could not be sent', async () => {
    servicios({ sweego: false });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect((await post(mensaje)).status).toBe(502);
  });
});
