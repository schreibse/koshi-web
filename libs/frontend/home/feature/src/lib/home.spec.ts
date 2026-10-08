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
});
