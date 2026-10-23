-- A post is public once `publicado` (YYYY-MM-DD) is today or earlier and it has a text in every locale.
CREATE TABLE articulos (
  id INTEGER PRIMARY KEY,
  publicado TEXT,
  actualizado TEXT NOT NULL
);

-- `cuerpo` is Markdown, limited to the blocks in libs/shared/blog/util when rendered.
CREATE TABLE textos (
  articulo INTEGER NOT NULL REFERENCES articulos (id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en')),
  slug TEXT NOT NULL CHECK (slug <> '' AND slug NOT GLOB '*[^a-z0-9-]*'),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  PRIMARY KEY (articulo, locale),
  UNIQUE (locale, slug)
);
