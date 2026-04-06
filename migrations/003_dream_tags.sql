-- Migration 003: Dream tags and favourites
-- Allows richer categorisation and bookmarking of dreams

CREATE TABLE IF NOT EXISTS dream_tags (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#d3bbff',    -- hex colour
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS dream_tag_mappings (
  dream_id TEXT NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  tag_id   TEXT NOT NULL REFERENCES dream_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (dream_id, tag_id)
);

ALTER TABLE dreams ADD COLUMN IF NOT EXISTS is_favourite INTEGER NOT NULL DEFAULT 0;
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS notes        TEXT;

CREATE INDEX IF NOT EXISTS idx_dream_tags_user_id ON dream_tags(user_id);
