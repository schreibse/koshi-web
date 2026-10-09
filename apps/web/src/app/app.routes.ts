import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: $localize`:@@home.pageTitle:Koshisoftware · Desarrollo Angular y NestJS en Perú`,
    loadComponent: () =>
      import('@koshi/frontend/home/feature').then((m) => m.Home),
  },
  { path: '**', redirectTo: '' },
];
