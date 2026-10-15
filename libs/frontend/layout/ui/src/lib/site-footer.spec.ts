import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('links the Libro de Reclamaciones on every page', async () => {
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a[href="libro-de-reclamaciones/"]',
    );

    expect(link?.textContent?.trim()).toBe('Libro de Reclamaciones');
  });
});
