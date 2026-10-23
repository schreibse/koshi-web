import { REQUEST_CONTEXT, inject } from '@angular/core';
import type { ContextoBlog, PaginaBlog } from '@koshi/shared/blog/util';

/** The blog page the Worker loaded for this request; only set while rendering on the server. */
export function paginaBlog(): PaginaBlog | undefined {
  return (inject(REQUEST_CONTEXT, { optional: true }) as ContextoBlog | null)
    ?.blog;
}
