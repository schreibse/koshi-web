-- One row per Hoja de Reclamación; the number restarts every year (Nº 000000001-YYYY).
CREATE TABLE hojas (
  anio INTEGER NOT NULL,
  secuencia INTEGER NOT NULL,
  registrada TEXT NOT NULL,
  hoja TEXT NOT NULL,
  respuesta TEXT,
  respondida TEXT,
  PRIMARY KEY (anio, secuencia)
);
