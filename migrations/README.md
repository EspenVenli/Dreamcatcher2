# Database Migrations

SQL migrations for Dreamcatcher using SQLite (or any compatible SQL database).

## Running Migrations

Migrations are numbered and must be run in order. Each file is idempotent — safe to re-run.

```bash
# SQLite example
sqlite3 dreamcatcher.db < migrations/001_initial_schema.sql
sqlite3 dreamcatcher.db < migrations/002_user_profile.sql
sqlite3 dreamcatcher.db < migrations/003_dream_tags.sql
```

## Migration Log

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Core tables: `users`, `dreams`, `weekly_synthesis` |
| `002_user_profile.sql`   | Extended onboarding profile fields |
| `003_dream_tags.sql`     | Tags, favourites, and per-dream notes |
