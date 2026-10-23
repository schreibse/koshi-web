import { TestBed } from '@angular/core/testing';
import type { Articulo } from '@koshi/shared/blog/util';
import { Api } from './api';
import { Editor } from './editor';

const borrador: Articulo = {
  id: 7,
  publicado: null,
  actualizado: '2026-10-23T12:00:00Z',
  textos: {
    en: {
      slug: 'cats',
      titulo: 'Cats',
      descripcion: 'About cats.',
      cuerpo: '## Cats',
    },
  },
};

describe('Editor', () => {
  async function render() {
    const api = {
      leer: vi.fn(async () => borrador),
      guardar: vi.fn(async (_id: number, textos: Articulo['textos']) => ({
        ...borrador,
        textos,
      })),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: Api, useValue: api }],
    });
    const fixture = TestBed.createComponent(Editor);
    fixture.componentRef.setInput('id', 7);
    await fixture.whenStable();
    return { api, fixture, el: fixture.nativeElement as HTMLElement };
  }

  const boton = (el: HTMLElement, nombre: string) =>
    [...el.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === nombre,
    ) as HTMLButtonElement;

  it('loads the post and previews its body', async () => {
    const { api, el } = await render();

    expect(api.leer).toHaveBeenCalledWith(7);
    expect(el.querySelector<HTMLInputElement>('#campo-titulo')?.value).toBe(
      'Cats',
    );
    expect(
      el.querySelector('[aria-label="Preview"] h2:last-of-type')?.textContent,
    ).toBe('Cats');
    expect(boton(el, 'Save').disabled).toBe(true);
  });

  it('shows what saving would refuse, next to the field', async () => {
    const { fixture, el } = await render();
    const cuerpo = el.querySelector<HTMLTextAreaElement>('#campo-cuerpo');
    if (!cuerpo) throw new Error('no body field');

    cuerpo.value = '# Too big';
    cuerpo.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(el.querySelector('#problemas-cuerpo')?.textContent?.trim()).toBe(
      'Only ## and ### headings are allowed: # Too big',
    );
    expect(cuerpo.getAttribute('aria-invalid')).toBe('true');
    expect(boton(el, 'Publish').disabled).toBe(true);
  });

  it('saves only the languages that hold text', async () => {
    const { api, fixture, el } = await render();
    const titulo = el.querySelector<HTMLInputElement>('#campo-titulo');
    if (!titulo) throw new Error('no title field');

    titulo.value = 'Cats!';
    titulo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    boton(el, 'Save').click();
    await fixture.whenStable();

    expect(api.guardar).toHaveBeenCalledWith(7, {
      en: { ...borrador.textos.en, titulo: 'Cats!' },
    });
    expect(el.querySelector('[role="status"]')?.textContent).toBe('Saved.');
  });
});
