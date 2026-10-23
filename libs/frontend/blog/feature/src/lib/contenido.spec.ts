import { TestBed } from '@angular/core/testing';
import { aBloques } from '@koshi/shared/blog/util';
import { Contenido } from './contenido';

describe('Contenido', () => {
  async function render(markdown: string) {
    const fixture = TestBed.createComponent(Contenido);
    fixture.componentRef.setInput('bloques', aBloques(markdown));
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('builds headings, lists and inline formatting as elements', async () => {
    const el = await render(
      '## Título\n\nUn [enlace](https://angular.dev) con **negrita**.\n\n- a\n- b',
    );

    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Título');
    expect(el.querySelector('a')?.getAttribute('href')).toBe(
      'https://angular.dev',
    );
    expect(el.querySelector('p')?.textContent).toBe('Un enlace con negrita.');
    expect(el.querySelectorAll('ul li')).toHaveLength(2);
  });

  it('shows raw HTML as text, never as markup', async () => {
    const el = await render('<img src=x onerror=alert(1)>');

    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('keeps code as text inside pre', async () => {
    const el = await render('```html\n<b>x</b>\n```');

    expect(el.querySelector('pre code')?.textContent).toBe('<b>x</b>');
    expect(el.querySelector('pre b')).toBeNull();
  });

  it('reserves the space of an image whose size is known', async () => {
    const fixture = TestBed.createComponent(Contenido);
    fixture.componentRef.setInput('bloques', [
      {
        tipo: 'imagen',
        src: '/media/x',
        alt: 'Un gato',
        ancho: 1376,
        alto: 900,
      },
      { tipo: 'imagen', src: '/media/y', alt: 'Otro' },
    ]);
    await fixture.whenStable();
    const [conTamano, sinTamano] = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('img');

    expect(conTamano.getAttribute('width')).toBe('1376');
    expect(conTamano.getAttribute('height')).toBe('900');
    expect(sinTamano.hasAttribute('width')).toBe(false);
  });
});
