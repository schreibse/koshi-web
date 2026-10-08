import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@koshi/frontend/home/feature').then((m) => m.Home),
  },
  { path: '**', redirectTo: '' },
];
