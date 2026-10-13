import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { appRoutes } from './app.routes';
import { serverRoutes } from './app.routes.server';
import { provideHeadLinks } from './head-links';

const serverConfig: ApplicationConfig = {
  // The router only lists, titles and redirects the pages to prerender; App picks the page itself.
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideRouter(appRoutes),
    provideHeadLinks(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
