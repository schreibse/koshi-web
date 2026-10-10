import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LibroDeReclamaciones } from './libro-de-reclamaciones';

describe('LibroDeReclamaciones', () => {
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
    fetchMock = vi.fn(async () =>
      Response.json({
        numero: '000000001-2026',
        registrada: '2026-10-09T20:00:00Z',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => vi.unstubAllGlobals());

  async function render() {
    const fixture = TestBed.createComponent(LibroDeReclamaciones);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const field = (label: string, index = 0) =>
      [...host.querySelectorAll('ks-campo')]
        .filter(
          (c) => c.querySelector('label span')?.textContent?.trim() === label,
        )
        [index].querySelector<HTMLInputElement>('input, textarea, select')!;
    const type = (label: string, value: string) => {
      const input = field(label);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const click = (el: Element | null) => (el as HTMLElement).click();
    const submit = async () => {
      click(host.querySelector('button[type=submit]'));
      await fixture.whenStable();
    };
    const fill = () => {
      type('Nombre completo', 'Ana Quispe');
      type('Número de documento', '12345678');
      type('Domicilio', 'Av. Lima 123');
      type('Teléfono', '999888777');
      type('Correo electrónico', 'ana@ejemplo.pe');
      type('Descripción del servicio', 'Aplicación web');
      type('Monto reclamado (S/)', '0');
      type('Detalle', 'Me atendieron mal.');
      type('Pedido', 'Una disculpa.');
      click(host.querySelector('input[value=queja]'));
      click(host.querySelectorAll('input[type=checkbox]')[1]);
    };
    return { host, fixture, type, click, submit, fill };
  }

  it('shows the errors and sends nothing while the sheet is incomplete', async () => {
    const page = await render();
    await page.submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(page.host.textContent).toContain('Este campo es obligatorio.');
  });

  it('files a complete sheet and opens its receipt', async () => {
    const page = await render();
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    page.fill();
    await page.submit();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['X-Turnstile-Token']).toBe('token-1');
    expect(JSON.parse(init.body)).toEqual({
      consumidor: {
        nombre: 'Ana Quispe',
        documento: 'DNI',
        numeroDocumento: '12345678',
        domicilio: 'Av. Lima 123',
        telefono: '999888777',
        email: 'ana@ejemplo.pe',
      },
      apoderado: null,
      servicio: 'Aplicación web',
      monto: 0,
      tipo: 'queja',
      detalle: 'Me atendieron mal.',
      pedido: 'Una disculpa.',
    });
    expect(navigate).toHaveBeenCalledWith(
      ['hoja'],
      expect.objectContaining({
        state: {
          recibo: expect.objectContaining({ numero: '000000001-2026' }),
        },
      }),
    );
  });

  it('asks for the guardian only when the consumer is a minor', async () => {
    const page = await render();
    expect(page.host.textContent).not.toContain('apoderado');

    page.click(page.host.querySelector('input[type=checkbox]'));
    await page.fixture.whenStable();
    expect(page.host.textContent).toContain(
      'Datos de tu madre, padre o apoderado',
    );
  });

  it('sends nothing until the security check has passed', async () => {
    turnstile.render.mockImplementation(() => 'widget-1');
    const page = await render();
    page.fill();
    await page.submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(page.host.textContent).toContain(
      'Completa la verificación de seguridad',
    );
  });

  it('resets the check when the server refuses its token', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }));
    const page = await render();
    page.fill();
    await page.submit();

    expect(turnstile.reset).toHaveBeenCalledWith('widget-1');
    expect(page.host.textContent).toContain(
      'Completa la verificación de seguridad',
    );
  });
});
