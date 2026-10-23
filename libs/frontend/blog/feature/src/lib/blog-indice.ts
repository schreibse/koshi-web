import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { paginaBlog } from './contexto';

/** All published posts, newest first. */
@Component({
  selector: 'ks-blog-indice',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
      <span class="eyebrow">Blog</span>
      <h1 class="text-4xl md:text-6xl" i18n="@@blog.title">
        Notas de mi trabajo
      </h1>
      @if (posts.length) {
        <ul class="m-0 mt-10 grid list-none gap-10 p-0">
          @for (post of posts; track post.slug) {
            <li>
              <p class="m-0 text-sm text-muted">
                <time [attr.datetime]="post.publicado">{{
                  post.publicado | date: 'longDate'
                }}</time>
              </p>
              <h2 class="m-0 mt-1 text-2xl">
                <a [href]="'blog/' + post.slug + '/'">{{ post.titulo }}</a>
              </h2>
              <p class="m-0 mt-2 text-muted">{{ post.descripcion }}</p>
            </li>
          }
        </ul>
      } @else {
        <p class="mt-5 text-xl text-muted" i18n="@@blog.empty">
          Todavía no hay artículos.
        </p>
      }
    </section>
  `,
})
export class BlogIndice {
  protected readonly posts = (() => {
    const pagina = paginaBlog();
    return pagina?.tipo === 'indice' ? pagina.posts : [];
  })();

  constructor() {
    inject(Title).setTitle($localize`:@@blog.pageTitle:Blog · Koshisoftware`);
    const meta = inject(Meta);
    meta.updateTag({
      name: 'description',
      content: $localize`:@@blog.description:Artículos sobre desarrollo web con Angular: decisiones, errores y lo que aprendí al medirlos.`,
    });
    // An empty index is no page worth finding; it disappears from search until the first post.
    if (!this.posts.length) {
      meta.updateTag({ name: 'robots', content: 'noindex' });
    }
  }
}
