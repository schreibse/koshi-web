import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

@Component({
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  selector: 'ks-root',
  template: `
    <ks-site-header />
    <main>
      <router-outlet />
    </main>
    <ks-site-footer />
  `,
})
export class App {}
