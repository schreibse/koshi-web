import { TestBed } from '@angular/core/testing';
import { CasoLibro } from './caso-libro';

describe('CasoLibro', () => {
  async function render() {
    const fixture = TestBed.createComponent(CasoLibro);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('points every citation at a listed source', async () => {
    const host = await render();
    const refs = [...host.querySelectorAll('a[href^="#fuente-"]')].map((a) =>
      a.getAttribute('href')!.slice(1),
    );
    const sources = [...host.querySelectorAll('.fuentes li')].map(
      (li) => li.id,
    );

    expect(refs.length).toBeGreaterThan(0);
    expect(new Set(refs)).toEqual(new Set(sources));
  });

  it('opens each source in a new tab and dates it', async () => {
    const items = [...(await render()).querySelectorAll('.fuentes li')];

    for (const li of items) {
      expect(li.querySelector('a')?.target).toBe('_blank');
      expect(li.textContent).toContain('Consultado el 19 de octubre de 2026');
    }
  });

  it('says it is not legal advice', async () => {
    const aviso = (await render()).querySelector('#aviso');

    expect(aviso?.textContent).toContain('no constituye asesoría legal');
  });
});
