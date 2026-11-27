CREATE TABLE IF NOT EXISTS "novel" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "author" text,
  "cover" text,
  "intro" text,
  "status" text NOT NULL DEFAULT 'serializing',
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "novel_volume" (
  "id" text PRIMARY KEY NOT NULL,
  "novel_id" text NOT NULL REFERENCES "novel"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "novel_chapter" (
  "id" text PRIMARY KEY NOT NULL,
  "novel_id" text NOT NULL REFERENCES "novel"("id") ON DELETE CASCADE,
  "volume_id" text REFERENCES "novel_volume"("id") ON DELETE SET NULL,
  "title" text NOT NULL,
  "content" text NOT NULL DEFAULT '',
  "word_count" integer NOT NULL DEFAULT 0,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE INDEX IF NOT EXISTS "novel_volume_novel_idx" ON "novel_volume" ("novel_id", "sort_order");

CREATE INDEX IF NOT EXISTS "novel_chapter_novel_idx" ON "novel_chapter" ("novel_id", "sort_order");
