import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the wordmark', async () => {
    TestBed.configureTestingModule({
      imports: [App],
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const wordmark = (fixture.nativeElement as HTMLElement).querySelector(
      '.wordmark',
    );
    expect(wordmark?.textContent?.replace(/\s/g, '')).toBe('koshisoftware');
  });
});
