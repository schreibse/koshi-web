import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import {
  LOCALE_ID,
  REQUEST_CONTEXT,
  TransferState,
  type Provider,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ContextoBlog } from '@koshi/shared/blog/util';
import { LanguageSwitch, POST_PATHS } from './language-switch';

const rutas = { es: '/blog/por-que-angular/', en: '/blog/why-angular/' };

describe('LanguageSwitch', () => {
  async function link(
    locale: string,
    url: string,
    providers: Provider[] = [],
  ): Promise<HTMLAnchorElement> {
    TestBed.configureTestingModule({
      providers: [
        provideLocationMocks(),
        { provide: LOCALE_ID, useValue: locale },
        ...providers,
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

  it('links a post to its own slug in the other locale on the server', async () => {
    const context: ContextoBlog = {
      blog: {
        tipo: 'post',
        post: {
          slug: 'por-que-angular',
          titulo: '',
          descripcion: '',
          publicado: '2026-10-23',
          bloques: [],
          rutas,
        },
      },
    };
    const a = await link('es', '/blog/por-que-angular', [
      { provide: REQUEST_CONTEXT, useValue: context },
    ]);
    expect(a.getAttribute('href')).toBe('/en/blog/why-angular/');
    expect(TestBed.inject(TransferState).get(POST_PATHS, null)).toEqual(rutas);
  });

  it('takes the post paths the server passed on in the browser', async () => {
    const state = new TransferState();
    state.set(POST_PATHS, rutas);
    const a = await link('en-US', '/blog/why-angular', [
      { provide: TransferState, useValue: state },
    ]);
    expect(a.getAttribute('href')).toBe('/es/blog/por-que-angular/');
  });
});
