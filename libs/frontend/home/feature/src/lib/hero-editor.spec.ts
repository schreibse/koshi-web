import { TestBed } from '@angular/core/testing';
import { HeroEditor } from './hero-editor';

describe('HeroEditor', () => {
  let reducedMotion = false;

  beforeEach(() => {
    reducedMotion = false;
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: reducedMotion && query.includes('reduce'),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  async function render() {
    const fixture = TestBed.createComponent(HeroEditor);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    return {
      title: () => host.querySelector('.font-bold')?.textContent?.trim(),
      code: () => host.querySelector('pre:not(.invisible)')?.textContent ?? '',
      tab: (name: string) =>
        host.querySelector<HTMLButtonElement>(`#hero-tab-${name}`),
      tick: async (ms: number) => {
        vi.advanceTimersByTime(ms);
        await fixture.whenStable();
      },
    };
  }

  it('starts on the Angular component', async () => {
    const editor = await render();
    expect(editor.title()).toBe('pedidos.ts');
    expect(editor.code()).toContain('@Component');
    expect(editor.tab('web')?.getAttribute('aria-selected')).toBe('true');
  });

  it('shows the NestJS controller when api is chosen', async () => {
    const editor = await render();
    editor.tab('api')?.click();
    await editor.tick(0);
    expect(editor.title()).toBe('pedidos.controller.ts');
    expect(editor.code()).toContain("@Controller('pedidos')");
  });

  it('moves to the other tab with the arrow keys and focuses it', async () => {
    const editor = await render();
    editor
      .tab('web')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await editor.tick(0);
    expect(editor.title()).toBe('pedidos.controller.ts');
    expect(document.activeElement).toBe(editor.tab('api'));
  });

  it('swaps on its own every six seconds', async () => {
    const editor = await render();
    await editor.tick(6000);
    expect(editor.title()).toBe('pedidos.controller.ts');
    await editor.tick(6000);
    expect(editor.title()).toBe('pedidos.ts');
  });

  it('stops swapping once a tab is chosen', async () => {
    const editor = await render();
    editor.tab('api')?.click();
    await editor.tick(18000);
    expect(editor.title()).toBe('pedidos.controller.ts');
  });

  it('never swaps on its own when reduced motion is asked for', async () => {
    reducedMotion = true;
    const editor = await render();
    await editor.tick(18000);
    expect(editor.title()).toBe('pedidos.ts');
  });
});
