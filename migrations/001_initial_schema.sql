-- Migration 001: Initial schema
-- Creates core tables for users, dreams, and weekly synthesis

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email       TEXT UNIQUE,
  password_hash TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS dreams (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  date            TEXT NOT NULL,
  content         TEXT NOT NULL,
  cleaned_content TEXT,
  analysis        TEXT,
  lucidity        TEXT NOT NULL CHECK (lucidity IN ('Low', 'Medium', 'High')),
  symbols         TEXT NOT NULL DEFAULT '[]',   -- JSON array
  resonance       TEXT NOT NULL DEFAULT '{}',   -- JSON object: {calm, awe, fear}
  image_url       TEXT,
  duration_seconds INTEGER,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS weekly_synthesis (
  id                  TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date                TEXT NOT NULL,
  headline            TEXT NOT NULL,
  patterns            TEXT NOT NULL DEFAULT '[]',  -- JSON array
  celestial_alignment TEXT NOT NULL,
  shadow_work         TEXT NOT NULL,
  collective_whisper  TEXT NOT NULL,
  moodscape           TEXT NOT NULL DEFAULT '{}',  -- JSON object
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_dreams_user_id    ON dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_synthesis_user_id ON weekly_synthesis(user_id);
