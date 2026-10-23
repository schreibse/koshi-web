// Resolved by wrangler.toml's [alias] to the server bundle the web build writes.
declare module 'angular-server' {
  import type { ContextoBlog } from '@koshi/shared/blog/util';

  export function renderizar(
    request: Request,
    contexto: ContextoBlog,
  ): Promise<Response | null>;

  export function redireccion(request: Request): Promise<Response | null>;
}
