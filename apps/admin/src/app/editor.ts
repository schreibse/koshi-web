import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { Contenido } from '@koshi/frontend/blog/feature/contenido';
import {
  aBloques,
  problemas,
  type Articulo,
  type Problema,
  type Texto,
  type Textos,
} from '@koshi/shared/blog/util';
import type { Locale } from '@koshi/shared/locale/util';
import { Api, ErrorApi } from './api';
import { prepararImagen } from './imagen';

const NOMBRES: Record<Locale, string> = { en: 'English', es: 'Español' };
const CAMPOS = ['titulo', 'slug', 'descripcion', 'cuerpo'] as const;
const VACIO: Texto = { slug: '', titulo: '', descripcion: '', cuerpo: '' };

/** One post in both languages: fields, a preview rendered as the site renders it, save and publish. */
@Component({
  selector: 'ks-editor',
  imports: [Contenido],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:beforeunload)': 'avisar($event)' },
  styles: `
    .barra {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .barra .estado {
      margin-right: auto;
      color: var(--ks-muted);
      font-size: 1rem;
    }
    [role='tablist'] {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    [role='tab'][aria-selected='true'] {
      border-color: var(--ks-accent);
      background: var(--ks-accent);
      color: var(--ks-on-accent);
    }
    .columnas {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
    }
    @media (min-width: 64rem) {
      .columnas {
        grid-template-columns: minmax(0, 1fr) 43rem;
      }
    }
    .campo {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.35rem;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
    }
    textarea.input {
      min-height: 28rem;
      font-family: var(--ks-font-mono);
      font-size: 0.9375rem;
      line-height: 1.5;
      resize: vertical;
    }
    .problema {
      color: var(--ks-code-string);
      font-size: 0.9375rem;
      font-weight: 400;
    }
    .vista {
      padding: 1.5rem;
      border: 1px solid var(--ks-line);
      border-radius: var(--ks-radius);
    }
    .vista h2 {
      margin-bottom: 0.5rem;
      font-size: 2.25rem;
    }
  `,
  template: `
    <div class="barra">
      <a href="./" (click)="$event.preventDefault(); cerrar.emit()"
        >All posts</a
      >
      <span class="estado" role="status">{{ estado() }}</span>
      <button
        type="button"
        class="btn"
        [disabled]="ocupado() || !sucio()"
        (click)="guardar()"
      >
        Save
      </button>
      @if (articulo()?.publicado) {
        <button
          type="button"
          class="btn"
          [disabled]="ocupado()"
          (click)="publicar(false)"
        >
          Unpublish
        </button>
      } @else {
        <button
          type="button"
          class="btn btn-primary"
          [disabled]="ocupado() || sucio() || !publicable()"
          (click)="publicar(true)"
        >
          Publish
        </button>
      }
    </div>

    @for (p of generales(); track $index) {
      <p class="problema" role="alert">{{ p.mensaje }}</p>
    }

    <div role="tablist" aria-label="Language">
      @for (l of locales; track l) {
        <button
          type="button"
          role="tab"
          class="btn"
          [attr.aria-selected]="l === locale()"
          (click)="locale.set(l)"
        >
          {{ nombres[l] }}{{ conProblemas(l) ? ' ·' : '' }}
        </button>
      }
    </div>

    <div class="columnas">
      <div>
        @let texto = borrador()[locale()];
        @for (campo of campos; track campo) {
          <div class="campo">
            <label [for]="'campo-' + campo">{{ etiquetas[campo] }}</label>
            @if (campo === 'cuerpo') {
              <textarea
                class="input"
                [id]="'campo-' + campo"
                [attr.aria-describedby]="'problemas-' + campo"
                [attr.aria-invalid]="de(campo).length > 0"
                [value]="texto.cuerpo"
                (input)="cambiar(campo, $any($event.target).value)"
              ></textarea>
            } @else {
              <input
                class="input"
                [id]="'campo-' + campo"
                [attr.aria-describedby]="'problemas-' + campo"
                [attr.aria-invalid]="de(campo).length > 0"
                [value]="texto[campo]"
                (input)="cambiar(campo, $any($event.target).value)"
              />
            }
            <div [id]="'problemas-' + campo">
              @for (p of de(campo); track $index) {
                <p class="problema">{{ p.mensaje }}</p>
              }
            </div>
            @if (campo === 'slug' && !texto.slug && texto.titulo) {
              <button
                type="button"
                class="btn"
                (click)="cambiar('slug', slugDe(texto.titulo))"
              >
                Slug from title
              </button>
            }
          </div>
        }
        <label class="campo">
          Add image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            [disabled]="ocupado()"
            (change)="subir($event)"
          />
        </label>
      </div>

      <article class="vista" [attr.lang]="locale()" aria-label="Preview">
        <h2>{{ borrador()[locale()].titulo || 'Untitled' }}</h2>
        <ks-contenido [bloques]="bloques()" />
      </article>
    </div>
  `,
})
export class Editor {
  readonly id = input.required<number>();
  readonly cerrar = output<void>();

  private readonly api = inject(Api);
  // Posts are drafted in English first, then translated.
  protected readonly locales: readonly Locale[] = ['en', 'es'];
  protected readonly nombres = NOMBRES;
  protected readonly campos = CAMPOS;
  protected readonly etiquetas: Record<keyof Texto, string> = {
    titulo: 'Title',
    slug: 'Slug',
    descripcion: 'Description (search results, link previews)',
    cuerpo: 'Body (Markdown)',
  };

  protected readonly locale = signal<Locale>('en');
  protected readonly articulo = signal<Articulo | null>(null);
  protected readonly borrador = signal<Record<Locale, Texto>>({
    es: VACIO,
    en: VACIO,
  });
  private readonly guardado = signal('');
  private readonly delServidor = signal<Problema[]>([]);
  protected readonly ocupado = signal(true);
  protected readonly estado = signal('Loading…');

  /** A language counts once any of its fields holds text; empty ones are not saved. */
  private readonly textos = computed<Textos>(() =>
    Object.fromEntries(
      Object.entries(this.borrador()).filter(([, texto]) =>
        CAMPOS.some((campo) => texto[campo].trim()),
      ),
    ),
  );
  protected readonly sucio = computed(
    () => JSON.stringify(this.textos()) !== this.guardado(),
  );
  private readonly problemas = computed(() => [
    ...problemas(this.textos(), this.articulo()?.publicado != null),
    ...this.delServidor(),
  ]);
  protected readonly publicable = computed(
    () => problemas(this.textos(), true).length === 0,
  );
  protected readonly bloques = computed(() =>
    aBloques(this.borrador()[this.locale()].cuerpo),
  );
  protected readonly generales = computed(() =>
    this.problemas().filter((p) => !p.campo),
  );

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.cargar(id));
    });
  }

  protected de(campo: keyof Texto): Problema[] {
    return this.problemas().filter(
      (p) => p.locale === this.locale() && p.campo === campo,
    );
  }

  protected conProblemas(locale: Locale): boolean {
    return this.problemas().some((p) => p.locale === locale);
  }

  protected cambiar(campo: keyof Texto, valor: string): void {
    const locale = this.locale();
    this.borrador.update((b) => ({
      ...b,
      [locale]: { ...b[locale], [campo]: valor },
    }));
    this.delServidor.set([]);
  }

  protected slugDe(titulo: string): string {
    return titulo
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  protected guardar(): Promise<void> {
    return this.llamar('Saved.', () =>
      this.api.guardar(this.id(), this.textos()),
    );
  }

  protected publicar(publicar: boolean): Promise<void> {
    return this.llamar(publicar ? 'Published.' : 'Unpublished.', () =>
      this.api.publicar(this.id(), publicar),
    );
  }

  protected async subir(evento: Event): Promise<void> {
    const campo = evento.target as HTMLInputElement;
    const [archivo] = campo.files ?? [];
    if (!archivo) return;
    this.ocupado.set(true);
    this.estado.set('Uploading…');
    try {
      const { archivo: webp, ancho, alto } = await prepararImagen(archivo);
      const { src } = await this.api.subir(webp, ancho, alto);
      // Empty alt on purpose: saving refuses it until the image is described.
      const cuerpo = this.borrador()[this.locale()].cuerpo.trimEnd();
      this.cambiar('cuerpo', `${cuerpo}${cuerpo ? '\n\n' : ''}![](${src})\n`);
      this.estado.set('Image added; describe it between the brackets.');
    } catch (e) {
      this.estado.set((e as Error).message);
    } finally {
      campo.value = '';
      this.ocupado.set(false);
    }
  }

  protected avisar(evento: BeforeUnloadEvent): void {
    if (this.sucio()) evento.preventDefault();
  }

  private async cargar(id: number): Promise<void> {
    await this.llamar('', () => this.api.leer(id));
  }

  private async llamar(
    hecho: string,
    llamada: () => Promise<Articulo>,
  ): Promise<void> {
    this.ocupado.set(true);
    try {
      this.mostrar(await llamada());
      this.estado.set(hecho || this.resumen());
    } catch (e) {
      this.delServidor.set(e instanceof ErrorApi ? e.problemas : []);
      this.estado.set(
        e instanceof ErrorApi && e.status === 422
          ? 'Not saved: see the problems below.'
          : (e as Error).message,
      );
    } finally {
      this.ocupado.set(false);
    }
  }

  private mostrar(articulo: Articulo): void {
    this.articulo.set(articulo);
    this.borrador.set({
      es: articulo.textos.es ?? VACIO,
      en: articulo.textos.en ?? VACIO,
    });
    this.guardado.set(JSON.stringify(this.textos()));
    this.delServidor.set([]);
  }

  private resumen(): string {
    const publicado = this.articulo()?.publicado;
    return publicado ? `Published ${publicado}.` : 'Draft.';
  }
}
