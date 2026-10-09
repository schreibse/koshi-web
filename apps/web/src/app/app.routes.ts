import { Route } from '@angular/router';
import {
  CasoKoshisoftware,
  Empresas,
  Home,
} from '@koshi/frontend/home/feature';
import { NotFound } from '@koshi/frontend/layout/ui';
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
    title: $localize`:@@home.pageTitle:Koshisoftware · Desarrollo Angular y NestJS en Perú`,
    component: Home,
  },
  {
    path: 'libro-de-reclamaciones',
    title: $localize`:@@reclamaciones.pageTitle:Libro de Reclamaciones · Koshisoftware`,
    loadComponent: () =>
      import('@koshi/frontend/reclamaciones/feature').then(
        (m) => m.LibroDeReclamaciones,
      ),
  },
  {
    path: 'libro-de-reclamaciones/hoja',
    title: $localize`:@@recibo.pageTitle:Hoja de reclamación · Koshisoftware`,
    loadComponent: () =>
      import('@koshi/frontend/reclamaciones/feature').then((m) => m.Recibo),
  },
  {
    path: slug('empresas', locale),
    title: $localize`:@@empresas.pageTitle:Webs para empresas en Perú · Koshisoftware`,
    component: Empresas,
  },
  {
    path: `${slug('proyectos', locale)}/koshisoftware`,
    title: $localize`:@@caso.ks.pageTitle:Caso de estudio: koshisoftware.pe · Koshisoftware`,
    component: CasoKoshisoftware,
  },
  ...crossLocaleRedirects(locale).map(({ from, to }): Route => ({
    path: from,
    redirectTo: `/${to}`,
  })),
  // Prerendered as /404, then moved to 404.html for Cloudflare Pages (see the web build target).
  ...['404', '**'].map((path): Route => ({
    path,
    title: $localize`:@@notFound.pageTitle:Página no encontrada · Koshisoftware`,
    component: NotFound,
    data: { notFound: true },
  })),
];
