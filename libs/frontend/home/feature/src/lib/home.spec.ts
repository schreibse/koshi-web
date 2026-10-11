import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  it('has a single h1 and every section the header links to', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    for (const id of ['servicios', 'proyectos', 'nosotros', 'contacto']) {
      expect(host.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it('links every tool in the stack, named next to its logo, in a new tab', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const links = [
      ...(
        fixture.nativeElement as HTMLElement
      ).querySelectorAll<HTMLAnchorElement>('ks-tech-stack a'),
    ];

    expect(links.map((a) => a.href)).toContain('https://angular.dev/');
    for (const a of links) {
      expect(a.querySelector('svg[aria-hidden=true]')).not.toBeNull();
      expect(a.target).toBe('_blank');
      expect(a.rel).toBe('noopener');
      expect(a.textContent).toContain('(se abre en una pestaña nueva)');
    }
  });
});
