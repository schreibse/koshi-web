import { LOCALE_ID } from '@angular/core';
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

  it('links the blog, so phones reach it too', async () => {
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a[href="blog/"]',
    );

    expect(link?.textContent?.trim()).toBe('Blog');
  });

  it('links the privacy policy in this locale', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'es' }],
    });
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a[href="privacidad/"]',
    );

    expect(link?.textContent?.trim()).toBe('Política de privacidad');
  });
});
