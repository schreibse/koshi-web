import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Contenido } from './contenido';
import { paginaBlog } from './contexto';
import { minutosDeLectura } from './lectura';

@Component({
  selector: 'ks-blog-post',
  imports: [Contenido, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (post; as post) {
      <article class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
        <a
          href="blog/"
          class="mb-8 inline-flex items-center gap-1.5 font-mono text-[0.8rem] tracking-[0.06em] text-muted uppercase no-underline hover:text-ink"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span i18n="@@blog.all">Todos los artículos</span>
        </a>
        <p
          class="mb-3 font-mono text-[0.8rem] tracking-[0.06em] text-accent uppercase"
        >
          <time [attr.datetime]="post.publicado">{{
            post.publicado | date: 'longDate'
          }}</time>
          ·
          <span i18n="@@blog.readingTime">{{ minutos }} min de lectura</span>
        </p>
        <h1 class="border-b border-line pb-8 text-4xl md:text-5xl">
          {{ post.titulo }}
        </h1>
        <ks-contenido class="mt-8" [bloques]="post.bloques" />
      </article>
    }
  `,
})
export class BlogPost {
  protected readonly post = (() => {
    const pagina = paginaBlog();
    return pagina?.tipo === 'post' ? pagina.post : undefined;
  })();
  protected readonly minutos = this.post
    ? minutosDeLectura(this.post.bloques)
    : 0;

  constructor() {
    if (!this.post) return;
    inject(Title).setTitle(`${this.post.titulo} · Koshisoftware`);
    inject(Meta).updateTag({
      name: 'description',
      content: this.post.descripcion,
    });
  }
}
