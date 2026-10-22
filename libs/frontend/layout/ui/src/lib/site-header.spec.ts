import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('shows the wordmark, the homepage sections, the about page and the business page', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'es' }],
    });
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(
      host.querySelector('.wordmark')?.textContent?.replace(/\s/g, ''),
    ).toBe('koshisoftware');
    const anchors = [...host.querySelectorAll('nav a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(anchors).toEqual([
      '#servicios',
      '#proyectos',
      'sobre-mi/',
      'empresas/',
      'contacto/?tema=proyecto',
    ]);
  });
});
