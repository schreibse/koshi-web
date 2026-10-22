import { TestBed } from '@angular/core/testing';
import { Contacto } from './contacto';
import { activar } from './formulario';

describe('Contacto', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let turnstile: {
    render: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    turnstile = {
      render: vi.fn((_element, options) => {
        options.callback('token-1');
        return 'widget-1';
      }),
      reset: vi.fn(),
    };
    vi.stubGlobal('turnstile', turnstile);
    fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    history.replaceState(null, '', '/');
  });

  const settle = () => new Promise((resolve) => setTimeout(resolve));

  async function render() {
    const fixture = TestBed.createComponent(Contacto);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    activar(host);
    await settle();
    const control = (name: string) =>
      host.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
    const type = (name: string, value: string) => {
      control(name).value = value;
      control(name).dispatchEvent(new Event('input', { bubbles: true }));
    };
    const submit = async () => {
      host.querySelector<HTMLElement>('button[type=submit]')!.click();
      await settle();
    };
    const fill = () => {
      type('nombre', 'Ana Quispe');
      type('email', 'ana@ejemplo.pe');
      type('mensaje', 'Quiero una web.');
    };
    const failure = () => host.querySelector('[data-fallo]')!.textContent;
    return { host, control, type, submit, fill, failure };
  }

  it('shows the errors and sends nothing while the message is incomplete', async () => {
    const page = await render();
    await page.submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(page.host.textContent).toContain('Este campo es obligatorio.');
  });

  it('presets the topic from the link and explains the identity check for personal data', async () => {
    history.replaceState(null, '', '/?tema=datos');
    const page = await render();

    expect(page.control('tema').value).toBe('datos');
    expect(
      page.host.querySelector<HTMLElement>('[data-aviso-datos]')!.hidden,
    ).toBe(false);
  });

  it('ignores an unknown topic in the link', async () => {
    history.replaceState(null, '', '/?tema=spam');
    const page = await render();

    expect(page.control('tema').value).toBe('proyecto');
  });

  it('sends the message with the Turnstile token and confirms the address', async () => {
    const page = await render();
    page.fill();
    await page.submit();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/contacto');
    expect(init.headers['X-Turnstile-Token']).toBe('token-1');
    expect(JSON.parse(init.body)).toEqual({
      nombre: 'Ana Quispe',
      email: 'ana@ejemplo.pe',
      tema: 'proyecto',
      mensaje: 'Quiero una web.',
    });
    const enviado = page.host.querySelector<HTMLElement>('[data-enviado]')!;
    expect(enviado.hidden).toBe(false);
    expect(enviado.textContent).toContain('ana@ejemplo.pe.');
  });

  it('asks for the security check again when the server refuses the token', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    const page = await render();
    page.fill();
    await page.submit();

    expect(page.failure()).toContain('verificación de seguridad');
    expect(turnstile.reset).toHaveBeenCalledWith('widget-1');
  });

  it('says so when the message could not be sent', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 502 }));
    const page = await render();
    page.fill();
    await page.submit();

    expect(page.failure()).toContain('No se pudo enviar');
    expect(
      page.host.querySelector<HTMLElement>('[data-formulario]')!.hidden,
    ).toBe(false);
  });
});
