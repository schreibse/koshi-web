import { Route } from '@angular/router';
import {
  CasoKoshisoftware,
  Empresas,
  Home,
  PoliticaDePrivacidad,
} from '@koshi/frontend/home/feature';
import { NotFound } from '@koshi/frontend/layout/ui';
import {
  LibroDeReclamaciones,
  Privacidad,
} from '@koshi/frontend/reclamaciones/feature';
import {
  crossLocaleRedirects,
  slug,
  toLocale,
} from '@koshi/shared/locale/util';

// Each locale is its own build; $localize.locale says which one this is.
const locale = toLocale($localize.locale ?? 'es');

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'libro-de-reclamaciones',
    component: LibroDeReclamaciones,
  },
  {
    path: 'libro-de-reclamaciones/privacidad',
    component: Privacidad,
  },
  {
    path: slug('empresas', locale),
    component: Empresas,
  },
  {
    path: `${slug('proyectos', locale)}/koshisoftware`,
    component: CasoKoshisoftware,
  },
  {
    path: slug('privacidad', locale),
    component: PoliticaDePrivacidad,
  },
  ...crossLocaleRedirects(locale).map(({ from, to }): Route => ({
    path: from,
    redirectTo: `/${to}`,
  })),
  // Prerendered as /404, then moved to 404.html for Cloudflare Pages (see the web build target).
  ...['404', '**'].map((path): Route => ({
    path,
    component: NotFound,
    data: { notFound: true },
  })),
];
