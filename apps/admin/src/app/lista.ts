import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  resource,
  signal,
} from '@angular/core';
import { Api } from './api';

@Component({
  selector: 'ks-lista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .cabeza {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1rem;
    }
    th,
    td {
      padding: 0.6rem 0.5rem;
      border-bottom: 1px solid var(--ks-line);
      text-align: left;
    }
    th {
      color: var(--ks-muted);
      font-weight: 600;
    }
  `,
  template: `
    <div class="cabeza">
      <h1>Posts</h1>
      <button
        type="button"
        class="btn btn-primary"
        [disabled]="creando()"
        (click)="nuevo()"
      >
        New post
      </button>
    </div>
    @if (error(); as error) {
      <p role="alert">{{ error }}</p>
    }
    @if (fichas.error()) {
      <p role="alert">The posts could not be loaded.</p>
    } @else if (fichas.value(); as fichas) {
      @if (fichas.length === 0) {
        <p>No posts yet.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            @for (ficha of fichas; track ficha.id) {
              <tr>
                <td>
                  <a
                    [href]="'?articulo=' + ficha.id"
                    (click)="$event.preventDefault(); abrir.emit(ficha.id)"
                    >{{ ficha.titulos.en || ficha.titulos.es || 'Untitled' }}</a
                  >
                </td>
                <td>
                  {{
                    ficha.publicado ? 'Published ' + ficha.publicado : 'Draft'
                  }}
                </td>
                <td>{{ ficha.actualizado.slice(0, 10) }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    }
  `,
})
export class Lista {
  readonly abrir = output<number>();
  private readonly api = inject(Api);
  protected readonly fichas = resource({ loader: () => this.api.fichas() });
  protected readonly creando = signal(false);
  protected readonly error = signal('');

  protected async nuevo(): Promise<void> {
    this.creando.set(true);
    try {
      this.abrir.emit((await this.api.crear()).id);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.creando.set(false);
    }
  }
}
