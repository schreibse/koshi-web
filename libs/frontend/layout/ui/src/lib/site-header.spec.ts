import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('shows the wordmark and links to every homepage section', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
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
      '#nosotros',
      '#contacto',
    ]);
  });
});
