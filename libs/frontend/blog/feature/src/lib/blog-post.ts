import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Contenido } from './contenido';
import { paginaBlog } from './contexto';

@Component({
  selector: 'ks-blog-post',
  imports: [Contenido, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (post; as post) {
      <article class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
        <a href="blog/" class="eyebrow no-underline" i18n="@@blog.all"
          >Todos los artículos</a
        >
        <h1 class="text-4xl md:text-5xl">{{ post.titulo }}</h1>
        <p class="mt-4 text-sm text-muted">
          <time [attr.datetime]="post.publicado">{{
            post.publicado | date: 'longDate'
          }}</time>
        </p>
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

  constructor() {
    if (!this.post) return;
    inject(Title).setTitle(`${this.post.titulo} · Koshisoftware`);
    inject(Meta).updateTag({
      name: 'description',
      content: this.post.descripcion,
    });
  }
}
