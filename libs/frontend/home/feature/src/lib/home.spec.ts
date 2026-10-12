import { DeferBlockState, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  async function render() {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    for (const block of await fixture.getDeferBlocks()) {
      await block.render(DeferBlockState.Complete);
    }
    return fixture.nativeElement as HTMLElement;
  }

  it('has a single h1 and every section the header links to', async () => {
    const host = await render();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    for (const id of ['servicios', 'proyectos', 'nosotros', 'contacto']) {
      expect(host.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it('links every tool in the stack, named next to its logo, in a new tab', async () => {
    const links = [
      ...(await render()).querySelectorAll<HTMLAnchorElement>(
        'ks-tech-stack a',
      ),
    ];

    expect(links.map((a) => a.href)).toContain('https://angular.dev/');
    for (const a of links) {
      expect(a.querySelector('svg[aria-hidden=true]')).not.toBeNull();
      expect(a.target).toBe('_blank');
      expect(a.rel).toBe('noopener');
      expect(a.textContent).toContain('(se abre en una pestaña nueva)');
    }
  });

  it('numbers the five stages of the process in order', async () => {
    const stages = [
      ...(await render()).querySelectorAll('ks-process-pipeline h3'),
    ].map((h3) => h3.textContent?.replace(/\s+/g, ' ').trim());

    expect(stages).toEqual([
      '01 Conversamos',
      '02 Planificamos',
      '03 Construyo',
      '04 Lanzamos',
      '05 Acompaño',
    ]);
  });
});
