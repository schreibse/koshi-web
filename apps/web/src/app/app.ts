import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter, SiteHeader } from '@koshi/frontend/layout/ui';

@Component({
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  selector: 'ks-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ks-site-header />
    <main>
      <router-outlet />
    </main>
    <ks-site-footer />
  `,
})
export class App {}
