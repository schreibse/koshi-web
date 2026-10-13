import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageSwitch } from './language-switch';

describe('LanguageSwitch', () => {
  async function link(locale: string, url: string): Promise<HTMLAnchorElement> {
    TestBed.configureTestingModule({
      providers: [
        provideLocationMocks(),
        { provide: LOCALE_ID, useValue: locale },
      ],
    });
    TestBed.inject(Location).go(url);
    const fixture = TestBed.createComponent(LanguageSwitch);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector(
      'a',
    ) as HTMLAnchorElement;
  }

  it('links from Spanish to the same page in English', async () => {
    const a = await link('es', '/servicios');
    expect(a.getAttribute('href')).toBe('/en/servicios/');
    expect(a.getAttribute('hreflang')).toBe('en');
    expect(a.textContent?.trim()).toBe('EN');
  });

  it('links from English to Spanish', async () => {
    const a = await link('en-US', '/servicios');
    expect(a.getAttribute('href')).toBe('/es/servicios/');
  });

  it('translates the slug', async () => {
    const a = await link('es', '/empresas');
    expect(a.getAttribute('href')).toBe('/en/business/');
  });

  it('links the home page to the other home page', async () => {
    const a = await link('es', '');
    expect(a.getAttribute('href')).toBe('/en/');
  });
});
