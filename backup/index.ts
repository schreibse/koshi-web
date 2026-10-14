import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from 'cloudflare:workers';

interface Exportacion {
  at_bookmark?: string;
  signed_url?: string;
  filename?: string;
}

/** Exports the Libro's D1 database as SQL and stores it in R2 with its SHA-256, which R2 verifies on upload. */
export class Respaldo extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    const marcador = await step.do('iniciar exportación', async () => {
      const { at_bookmark } = await this.exportar({ output_format: 'polling' });
      if (!at_bookmark) throw new Error('sin at_bookmark');
      return at_bookmark;
    });

    await step.do('guardar en R2', async () => {
      const { signed_url, filename } = await this.exportar({
        current_bookmark: marcador,
      });
      // Not ready yet: throwing makes the step retry.
      if (!signed_url || !filename) throw new Error('exportación en curso');
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

  private async exportar(cuerpo: object): Promise<Exportacion> {
    const respuesta = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.env.ACCOUNT_ID}/d1/database/${this.env.DATABASE_ID}/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.env.D1_API_TOKEN}`,
        },
        body: JSON.stringify(cuerpo),
      },
    );
    if (!respuesta.ok) throw new Error(`exportar ${respuesta.status}`);
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
} satisfies ExportedHandler<Env>;
