import { beforeEach, describe, expect, it, vi } from 'vitest';
import { paginaBlog } from './blog';

const renderizar = vi.hoisted(() =>
  vi.fn(async () => new Response('rendered')),
);
vi.mock('angular-server', () => ({ renderizar }));

function blogDb(filas: { all?: unknown[]; first?: unknown }) {
  const consultas: { sql: string; params: unknown[] }[] = [];
  const db = {
    prepare: (sql: string) => ({
      bind: (...params: unknown[]) => {
        consultas.push({ sql, params });
        return {
          all: async () => ({ results: filas.all ?? [] }),
          first: async () => filas.first ?? null,
        };
      },
    }),
  };
  return { env: { BLOG: db } as unknown as Env, consultas };
}

const pedir = (path: string, env: Env) =>
  paginaBlog(new Request(`https://koshisoftware.pe${path}`), env);

describe('paginaBlog', () => {
  beforeEach(() => renderizar.mockClear());

  it.each(['/es/', '/es/blogs/', '/de/blog/', '/es/blog/a/b/', '/es/blog/A/'])(
    'leaves %s alone',
    async (path) => {
      expect(await pedir(path, blogDb({}).env)).toBeNull();
    },
  );

  it.each([
    ['/es/blog', 'https://koshisoftware.pe/es/blog/'],
    ['/en/blog/hello?x=1', 'https://koshisoftware.pe/en/blog/hello/?x=1'],
  ])('redirects %s to its slashed URL', async (path, location) => {
    const res = await pedir(path, blogDb({}).env);
    expect(res?.status).toBe(307);
    expect(res?.headers.get('Location')).toBe(location);
  });

  it('renders the index with the posts of its locale', async () => {
    const posts = [
      {
        slug: 'hola',
        titulo: 'Hola',
        descripcion: 'd',
        publicado: '2026-10-23',
      },
    ];
    const { env, consultas } = blogDb({ all: posts });

    const res = await pedir('/en/blog/', env);

    expect(await res?.text()).toBe('rendered');
    expect(res?.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(consultas[0].params).toEqual(['en']);
    expect(renderizar).toHaveBeenCalledWith(expect.any(Request), {
      blog: { tipo: 'indice', posts },
    });
  });

  it('renders a post with its blocks and its path in both locales', async () => {
    const { env, consultas } = blogDb({
      first: {
        slug: 'por-que-angular',
        titulo: '¿Por qué Angular?',
        descripcion: 'd',
        publicado: '2026-10-23',
        cuerpo: '## Uno',
        otroLocale: 'en',
        otroSlug: 'why-angular',
      },
    });

    await pedir('/es/blog/por-que-angular/', env);

    expect(consultas[0].params).toEqual(['es', 'por-que-angular']);
    expect(renderizar).toHaveBeenCalledWith(expect.any(Request), {
      blog: {
        tipo: 'post',
        post: {
          slug: 'por-que-angular',
          titulo: '¿Por qué Angular?',
          descripcion: 'd',
          publicado: '2026-10-23',
          bloques: [
            {
              tipo: 'titulo',
              nivel: 2,
              hijos: [{ tipo: 'texto', texto: 'Uno' }],
            },
          ],
          rutas: { es: '/blog/por-que-angular/', en: '/blog/why-angular/' },
        },
      },
    });
  });

  it('leaves an unknown post to the 404 page', async () => {
    expect(await pedir('/es/blog/nada/', blogDb({}).env)).toBeNull();
    expect(renderizar).not.toHaveBeenCalled();
  });

  it('gives uploaded images their stored size', async () => {
    const id = '0123456789abcdef0123456789abcdef';
    const { env, consultas } = blogDb({
      first: {
        slug: 'gatos',
        titulo: 'Gatos',
        descripcion: 'd',
        publicado: '2026-10-23',
        cuerpo: `![Un gato](/media/${id})\n\n> ![Otro](https://x.pe/a.png)`,
        otroLocale: 'en',
        otroSlug: 'cats',
      },
      all: [{ id, ancho: 1376, alto: 900 }],
    });

    await pedir('/es/blog/gatos/', env);

    expect(consultas[1].params).toEqual([JSON.stringify([id])]);
    const [, contexto] = renderizar.mock.calls[0] as unknown as [
      Request,
      { blog: { post: { bloques: unknown[] } } },
    ];
    expect(contexto.blog.post.bloques).toEqual([
      {
        tipo: 'imagen',
        src: `/media/${id}`,
        alt: 'Un gato',
        ancho: 1376,
        alto: 900,
      },
      {
        tipo: 'cita',
        hijos: [{ tipo: 'imagen', src: 'https://x.pe/a.png', alt: 'Otro' }],
      },
    ]);
  });
});
