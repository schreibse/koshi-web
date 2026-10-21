-- When Sweego accepted the consumer's copy, and its id, as proof of the copy the Reglamento requires.
ALTER TABLE hojas ADD COLUMN copia_enviada TEXT;
ALTER TABLE hojas ADD COLUMN copia_id TEXT;
-- Spam is flagged, never deleted: numbers must stay gap-free and sheets are kept two years.
ALTER TABLE hojas ADD COLUMN spam INTEGER NOT NULL DEFAULT 0;
