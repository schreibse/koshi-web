import { RenderMode, ServerRoute } from '@angular/ssr';

// Blog pages come from D1 at request time, so the Worker renders them; everything else is built once.
export const serverRoutes: ServerRoute[] = [
  { path: 'blog', renderMode: RenderMode.Server },
  { path: 'blog/:slug', renderMode: RenderMode.Server },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
