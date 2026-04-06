-- Migration 002: Extended user profile
-- Adds onboarding fields collected during setup

CREATE TABLE IF NOT EXISTS user_profiles (
  id               TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id          TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Step 1: Identity
  age              INTEGER,
  star_sign        TEXT,

  -- Step 2: Goals (stored as JSON array of goal IDs)
  goals            TEXT NOT NULL DEFAULT '[]',

  -- Step 3: Dream landscape
  recurring_dreams TEXT,                            -- free-text description
  typical_moods    TEXT NOT NULL DEFAULT '[]',      -- JSON array of EmotionalTone

  -- Step 4: Sleep schedule
  bedtime          TEXT,                            -- HH:MM (24h)
  wake_time        TEXT,                            -- HH:MM (24h)
  dream_recall     TEXT CHECK (dream_recall IN ('rarely', 'sometimes', 'often', 'almost-always')),

  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
