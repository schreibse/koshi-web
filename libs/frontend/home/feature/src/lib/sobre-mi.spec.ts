import { TestBed } from '@angular/core/testing';
import { SobreMi } from './sobre-mi';

describe('SobreMi', () => {
  async function render() {
    const fixture = TestBed.createComponent(SobreMi);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('never calls the author an engineer, a regulated title in Peru', async () => {
    expect((await render()).textContent).not.toMatch(/ingenier[oa]/i);
  });

  it('shows the master degree as awarded, untranslated', async () => {
    expect((await render()).textContent).toContain(
      'Diplom-Ingenieur für technisch-wissenschaftliche Berufe',
    );
  });

  it('lists the career oldest first', async () => {
    const years = [...(await render()).querySelectorAll('ol li')].map((li) =>
      li.textContent!.trim().slice(0, 4),
    );

    expect(years).toEqual(['2009', '2017', '2021']);
  });
});
