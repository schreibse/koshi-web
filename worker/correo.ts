const SWEEGO = 'https://api.sweego.io/send';

export interface Buzon {
  email: string;
  name: string;
}

/** Sends through Sweego; returns its transaction id, or null when nothing was sent. */
export async function enviar(
  env: Env,
  de: Buzon,
  para: Buzon,
  responderA: Buzon,
  { asunto, texto }: { asunto: string; texto: string },
): Promise<string | null> {
  if (!env.SWEEGO_API_KEY) {
    console.log('sin SWEEGO_API_KEY, no enviado:', para.email, asunto);
    return null;
  }
  const respuesta = await fetch(SWEEGO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': env.SWEEGO_API_KEY,
    },
    body: JSON.stringify({
      channel: 'email',
      provider: 'sweego',
      from: de,
      'reply-to': responderA,
      recipients: [para],
      subject: asunto,
      'message-txt': texto,
    }),
  });
  if (!respuesta.ok) {
    console.error('sweego', respuesta.status, await respuesta.text());
    return null;
  }
  const { transaction_id } = await respuesta.json<{
    transaction_id?: string;
  }>();
  return transaction_id ?? '';
}
