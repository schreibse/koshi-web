import { Route } from '@angular/router';
import { slug, toLocale } from '@koshi/shared/locale/util';

// Each locale is its own build; $localize.locale says which one this is.
const locale = toLocale($localize.locale ?? 'es');

export const appRoutes: Route[] = [
  {
    path: '',
    title: $localize`:@@home.pageTitle:Koshisoftware · Desarrollo Angular y NestJS en Perú`,
    loadComponent: () =>
      import('@koshi/frontend/home/feature').then((m) => m.Home),
  },
  {
    path: slug('empresas', locale),
    title: $localize`:@@empresas.pageTitle:Webs para empresas en Perú · Koshisoftware`,
    loadComponent: () =>
      import('@koshi/frontend/home/feature').then((m) => m.Empresas),
  },
  { path: '**', redirectTo: '' },
];
