const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function humano(
  request: Request,
  secret: string,
): Promise<boolean> {
  const token = request.headers.get('X-Turnstile-Token');
  if (!token) return false;
  const datos = new FormData();
  datos.append('secret', secret);
  datos.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) datos.append('remoteip', ip);
  const respuesta = await fetch(SITEVERIFY, { method: 'POST', body: datos });
  if (!respuesta.ok) return false;
  const { success } = await respuesta.json<{ success: boolean }>();
  return success;
}
