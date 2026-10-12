import { TestBed } from '@angular/core/testing';
import { CasoKoshisoftware } from './caso-koshisoftware';

describe('CasoKoshisoftware', () => {
  async function render() {
    const fixture = TestBed.createComponent(CasoKoshisoftware);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('has a single h1 and all four Lighthouse scores', async () => {
    const host = await render();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelectorAll('[aria-label=Lighthouse] li')).toHaveLength(4);
  });

  it('links the public code in a new tab, said so to screen readers', async () => {
    const code = (await render()).querySelector<HTMLAnchorElement>(
      'a[href^="https://github.com/"]',
    );

    expect(code?.target).toBe('_blank');
    expect(code?.rel).toBe('noopener');
    expect(code?.textContent).toContain('(se abre en una pestaña nueva)');
  });
});
