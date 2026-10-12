import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHeadLinks } from './head-links';
import {
  provideClientHydration,
  withEventReplay,
  withI18nSupport,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay(),
      withI18nSupport(),
      withIncrementalHydration(),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHeadLinks(),
  ],
};
