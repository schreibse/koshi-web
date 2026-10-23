-- Images uploaded through the admin; `id` is also the R2 key and the `/media/<id>` path.
CREATE TABLE imagenes (
  id TEXT PRIMARY KEY CHECK (length(id) = 32 AND id NOT GLOB '*[^0-9a-f]*'),
  tipo TEXT NOT NULL,
  ancho INTEGER NOT NULL CHECK (ancho > 0),
  alto INTEGER NOT NULL CHECK (alto > 0),
  bytes INTEGER NOT NULL,
  subida TEXT NOT NULL
);
