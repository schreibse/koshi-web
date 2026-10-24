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
        <ul class="m-0 mt-10 list-none p-0">
          @for (post of posts; track post.slug) {
            <li
              class="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-t border-line px-1 py-6 last:border-b hover:bg-surface md:grid-cols-[13rem_1fr_auto] md:gap-x-8 md:px-3 md:py-7"
            >
              <p
                class="col-span-full m-0 font-mono text-[0.8rem] tracking-[0.06em] text-accent uppercase md:col-span-1"
              >
                <time [attr.datetime]="post.publicado">{{
                  post.publicado | date: 'longDate'
                }}</time>
              </p>
              <div>
                <h2 class="m-0 text-2xl group-hover:text-accent">
                  <a
                    class="text-inherit no-underline after:absolute after:inset-0 after:content-['']"
                    [href]="'blog/' + post.slug + '/'"
                    >{{ post.titulo }}</a
                  >
                </h2>
                <p class="m-0 mt-2 text-muted">{{ post.descripcion }}</p>
              </div>
              <svg
                class="size-5 text-muted transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
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
