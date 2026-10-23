import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Editor } from './editor';
import { Lista } from './lista';

/** The blog admin: the post list, or one post's editor when the URL names it. */
@Component({
  selector: 'ks-root',
  imports: [Editor, Lista],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      max-width: 90rem;
      margin: 0 auto;
      padding: 1.5rem 1rem 4rem;
    }
    header {
      margin-bottom: 2rem;
      font-weight: 700;
    }
  `,
  template: `
    <header>
      <a href="./" (click)="abrir(null, $event)">Blog admin</a>
    </header>
    <main>
      @if (articulo(); as id) {
        <ks-editor [id]="id" (cerrar)="abrir(null)" />
      } @else {
        <ks-lista (abrir)="abrir($event)" />
      }
    </main>
  `,
})
export class App {
  protected readonly articulo = signal(idEnUrl());

  constructor() {
    const volver = () => this.articulo.set(idEnUrl());
    addEventListener('popstate', volver);
    inject(DestroyRef).onDestroy(() => removeEventListener('popstate', volver));
  }

  protected abrir(id: number | null, evento?: Event): void {
    evento?.preventDefault();
    history.pushState(null, '', id ? `?articulo=${id}` : './');
    this.articulo.set(id);
  }
}

function idEnUrl(): number | null {
  const id = Number(new URLSearchParams(location.search).get('articulo'));
  return Number.isInteger(id) && id > 0 ? id : null;
}
