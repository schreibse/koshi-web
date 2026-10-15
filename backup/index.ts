import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from 'cloudflare:workers';

interface Exportacion {
  at_bookmark: string;
  status?: 'complete' | 'error';
  error?: string;
  result?: { filename: string; signed_url: string };
}

/** Exports the Libro's D1 database as SQL and stores it in R2 with its SHA-256, which R2 verifies on upload. */
export class Respaldo extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    // One step: D1 cancels an export that is not polled continually, so a retry must start a new one.
    await step.do('exportar y guardar en R2', async () => {
      const { filename, signed_url } = await this.exportar();
      const volcado = await fetch(signed_url);
      if (!volcado.ok) throw new Error(`descarga ${volcado.status}`);
      const sql = await volcado.arrayBuffer();
      const sha256 = await crypto.subtle.digest('SHA-256', sql);
      await this.env.RESPALDOS.put(filename, sql, {
        sha256,
        customMetadata: { sha256: hex(sha256) },
      });
    });
  }

  private async exportar() {
    let marcador: string | undefined;
    for (let intento = 0; intento < 60; intento++) {
      const exportacion = await this.pedir(marcador);
      if (exportacion.status === 'complete' && exportacion.result)
        return exportacion.result;
      if (exportacion.status === 'error')
        throw new Error(`exportación: ${exportacion.error}`);
      marcador = exportacion.at_bookmark;
      await new Promise((listo) => setTimeout(listo, 1000));
    }
    throw new Error('exportación sin terminar tras 60 s');
  }

  private async pedir(marcador?: string): Promise<Exportacion> {
    const respuesta = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.env.ACCOUNT_ID}/d1/database/${this.env.DATABASE_ID}/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.env.D1_API_TOKEN}`,
        },
        body: JSON.stringify({
          output_format: 'polling',
          current_bookmark: marcador,
        }),
      },
    );
    if (!respuesta.ok)
      throw new Error(
        `exportar ${respuesta.status}: ${await respuesta.text()}`,
      );
    const { result } = await respuesta.json<{ result: Exportacion }>();
    return result;
  }
}

const hex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export default {
  fetch: () => new Response(null, { status: 404 }),
  scheduled: async (_controller, env) => {
    await env.RESPALDO.create();
  },
} satisfies ExportedHandler<Env>;
