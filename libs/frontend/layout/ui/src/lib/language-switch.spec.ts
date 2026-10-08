import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LanguageSwitch } from './language-switch';

describe('LanguageSwitch', () => {
  async function link(locale: string): Promise<HTMLAnchorElement> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: LOCALE_ID, useValue: locale },
      ],
    });
    await TestBed.inject(Router).navigateByUrl('/servicios');
    const fixture = TestBed.createComponent(LanguageSwitch);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector(
      'a',
    ) as HTMLAnchorElement;
  }

  it('links from Spanish to the same page in English', async () => {
    const a = await link('es');
    expect(a.getAttribute('href')).toBe('/en/servicios');
    expect(a.getAttribute('hreflang')).toBe('en');
    expect(a.textContent?.trim()).toBe('EN');
  });

  it('links from English to Spanish', async () => {
    const a = await link('en-US');
    expect(a.getAttribute('href')).toBe('/es/servicios');
  });
});
