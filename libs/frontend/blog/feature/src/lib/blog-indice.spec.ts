import { REQUEST_CONTEXT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import type { ContextoBlog, Resumen } from '@koshi/shared/blog/util';
import { BlogIndice } from './blog-indice';

describe('BlogIndice', () => {
  async function render(posts: Resumen[]) {
    const contexto: ContextoBlog = { blog: { tipo: 'indice', posts } };
    TestBed.configureTestingModule({
      providers: [{ provide: REQUEST_CONTEXT, useValue: contexto }],
    });
    const fixture = TestBed.createComponent(BlogIndice);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('links every post by its slug', async () => {
    const el = await render([
      {
        slug: 'hola',
        titulo: 'Hola',
        descripcion: 'd',
        publicado: '2026-10-23',
      },
    ]);

    expect(el.querySelector('h2 a')?.getAttribute('href')).toBe('blog/hola/');
    expect(TestBed.inject(Meta).getTag('name="robots"')).toBeNull();
  });

  it('keeps an empty index out of search engines', async () => {
    await render([]);

    expect(TestBed.inject(Meta).getTag('name="robots"')?.content).toBe(
      'noindex',
    );
  });
});
