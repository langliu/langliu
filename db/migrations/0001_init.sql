CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "email_verified" integer NOT NULL,
  "image" text,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" integer NOT NULL,
  "token" text NOT NULL UNIQUE,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" integer,
  "refresh_token_expires_at" integer,
  "scope" text,
  "password" text,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" integer NOT NULL,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "category" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "subcategory" (
  "id" text PRIMARY KEY NOT NULL,
  "category_id" text NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "nav_link" (
  "id" text PRIMARY KEY NOT NULL,
  "subcategory_id" text NOT NULL REFERENCES "subcategory"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "url" text NOT NULL,
  "description" text,
  "sort_order" integer NOT NULL DEFAULT 0
);

INSERT INTO "category" ("id", "name", "sort_order", "created_at") VALUES
  ('cat_dev', '开发', 0, 1700000000000),
  ('cat_read', '阅读', 1, 1700000000000),
  ('cat_life', '生活', 2, 1700000000000);

INSERT INTO "subcategory" ("id", "category_id", "name", "sort_order") VALUES
  ('sub_tools', 'cat_dev', '工具', 0),
  ('sub_docs', 'cat_dev', '文档', 1),
  ('sub_feeds', 'cat_read', '订阅', 0),
  ('sub_daily', 'cat_life', '日常', 0);

INSERT INTO "nav_link" ("id", "subcategory_id", "title", "url", "description", "sort_order") VALUES
  ('lnk_gh', 'sub_tools', 'GitHub', 'https://github.com', '代码与协作', 0),
  ('lnk_cf', 'sub_tools', 'Cloudflare', 'https://dash.cloudflare.com', 'Workers / D1 控制台', 1),
  ('lnk_ts', 'sub_docs', 'TanStack', 'https://tanstack.com', 'Router / Start / Query', 0),
  ('lnk_mdn', 'sub_docs', 'MDN', 'https://developer.mozilla.org', 'Web 文档', 1),
  ('lnk_hn', 'sub_feeds', 'Hacker News', 'https://news.ycombinator.com', NULL, 0);
