import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// File-backed JSON store. Production should swap this for a real DB +
// migration runner — see /migrations for the SQLite schema.
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

interface UserProfileStore {
  age?: number;
  starSign?: string;
  goals?: string[];
  recurringDreams?: string;
  typicalMoods?: string[];
  bedtime?: string;
  wakeTime?: string;
  dreamRecall?: string;
  updatedAt: string;
}

interface SleepEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  quality: number;       // 1–5
  bedtime?: string;
  wakeTime?: string;
  moodOnWake?: string;   // 'rested' | 'groggy' | 'anxious' | 'calm' | 'energetic'
  notes?: string;
  createdAt: string;
}

interface DreamTag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface Store {
  dreams: any[];
  synthesis: any;
  userProfile: UserProfileStore | null;
  sleepEntries: SleepEntry[];
  tags: DreamTag[];
}

const EMPTY_STORE: Store = {
  dreams: [],
  synthesis: null,
  userProfile: null,
  sleepEntries: [],
  tags: [],
};

function loadStore(): Store {
  try {
    if (!fs.existsSync(STORE_PATH)) return { ...EMPTY_STORE };
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...EMPTY_STORE, ...parsed };
  } catch (e) {
    console.warn('Failed to load store, starting fresh:', e);
    return { ...EMPTY_STORE };
  }
}

let store: Store = loadStore();
let saveTimer: NodeJS.Timeout | null = null;

function persist() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist store:', e);
    }
  }, 100);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------------------------------------------------------------------------

function parseCorsOrigins(): string[] | boolean {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw || raw === '*') return true;
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors({ origin: parseCorsOrigins(), credentials: true }));
  app.use(express.json({ limit: '50mb' }));

  // ── Dreams ──────────────────────────────────────────────────────────────

  app.get('/api/dreams', (req, res) => {
    const { q, lucidity, favorite, type, sort } = req.query as Record<string, string>;
    let results = [...store.dreams];

    if (q) {
      const term = q.toLowerCase();
      results = results.filter(d =>
        (d.title || '').toLowerCase().includes(term) ||
        (d.content || '').toLowerCase().includes(term) ||
        (d.cleanedContent || '').toLowerCase().includes(term) ||
        (d.symbols || []).some((s: string) => s.toLowerCase().includes(term)) ||
        (d.tags || []).some((s: string) => s.toLowerCase().includes(term))
      );
    }
    if (lucidity) results = results.filter(d => d.lucidity === lucidity);
    if (favorite === 'true') results = results.filter(d => d.isFavorite);
    if (type) results = results.filter(d => d.dreamType === type);

    if (sort === 'oldest') {
      results.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    } else if (sort === 'duration') {
      results.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sort === 'awe') {
      results.sort((a, b) => (b.resonance?.awe || 0) - (a.resonance?.awe || 0));
    } else {
      results.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    res.json(results);
  });

  app.post('/api/dreams', (req, res) => {
    const newDream = {
      id: uid(),
      ...req.body,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }),
      isFavorite: req.body.isFavorite ?? false,
      tags: req.body.tags ?? [],
      createdAt: new Date().toISOString(),
    };
    store.dreams.unshift(newDream);
    persist();
    res.status(201).json(newDream);
  });

  app.get('/api/dreams/:id', (req, res) => {
    const dream = store.dreams.find(d => d.id === req.params.id);
    if (!dream) return res.status(404).json({ error: 'Dream not found' });
    res.json(dream);
  });

  app.delete('/api/dreams/:id', (req, res) => {
    const idx = store.dreams.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Dream not found' });
    store.dreams.splice(idx, 1);
    persist();
    res.status(204).end();
  });

  app.patch('/api/dreams/:id', (req, res) => {
    const idx = store.dreams.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Dream not found' });
    store.dreams[idx] = {
      ...store.dreams[idx],
      ...req.body,
      id: store.dreams[idx].id,
      updatedAt: new Date().toISOString(),
    };
    persist();
    res.json(store.dreams[idx]);
  });

  // ── Stats ───────────────────────────────────────────────────────────────

  app.get('/api/stats', (_req, res) => {
    const dreams = store.dreams;
    const total = dreams.length;
    const lucidity = { Low: 0, Medium: 0, High: 0 };
    const symbolCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};
    const resonanceTotals = { calm: 0, awe: 0, fear: 0 };

    for (const d of dreams) {
      if (d.lucidity && (d.lucidity in lucidity)) {
        lucidity[d.lucidity as keyof typeof lucidity]++;
      }
      for (const s of d.symbols || []) {
        symbolCounts[s] = (symbolCounts[s] || 0) + 1;
      }
      if (d.createdAt) {
        const day = d.createdAt.slice(0, 10);
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      }
      if (d.resonance) {
        resonanceTotals.calm += d.resonance.calm || 0;
        resonanceTotals.awe += d.resonance.awe || 0;
        resonanceTotals.fear += d.resonance.fear || 0;
      }
    }

    const topSymbols = Object.entries(symbolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const avgResonance = total > 0 ? {
      calm: Math.round(resonanceTotals.calm / total),
      awe:  Math.round(resonanceTotals.awe / total),
      fear: Math.round(resonanceTotals.fear / total),
    } : { calm: 0, awe: 0, fear: 0 };

    // Streak: consecutive days ending today (or yesterday) with at least 1 dream
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dailyCounts[key]) streak++;
      else if (i > 0) break;
    }

    // Last 30 days timeline
    const timeline: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      timeline.push({ date: key, count: dailyCounts[key] || 0 });
    }

    const recentResonance = dreams.slice(0, 14).map(d => ({
      date: d.createdAt?.slice(0, 10) || '',
      calm: d.resonance?.calm || 0,
      awe:  d.resonance?.awe || 0,
      fear: d.resonance?.fear || 0,
    })).reverse();

    res.json({
      total,
      streak,
      lucidity,
      lucidPct: total > 0 ? Math.round((lucidity.High / total) * 100) : 0,
      topSymbols,
      timeline,
      recentResonance,
      avgResonance,
      sleepEntries: store.sleepEntries.length,
    });
  });

  // ── Weekly Synthesis ────────────────────────────────────────────────────

  app.get('/api/synthesis', (_req, res) => {
    res.json(store.synthesis);
  });

  app.post('/api/synthesis', (req, res) => {
    store.synthesis = {
      ...req.body,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }),
      createdAt: new Date().toISOString(),
    };
    persist();
    res.status(201).json(store.synthesis);
  });

  // ── User Profile ────────────────────────────────────────────────────────

  app.get('/api/user/profile', (_req, res) => {
    res.json(store.userProfile);
  });

  app.post('/api/user/profile', (req, res) => {
    store.userProfile = { ...req.body, updatedAt: new Date().toISOString() };
    persist();
    res.status(201).json(store.userProfile);
  });

  app.patch('/api/user/profile', (req, res) => {
    if (!store.userProfile) {
      store.userProfile = { updatedAt: new Date().toISOString() };
    }
    store.userProfile = {
      ...store.userProfile,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    persist();
    res.json(store.userProfile);
  });

  // ── Sleep entries ───────────────────────────────────────────────────────

  app.get('/api/sleep', (_req, res) => {
    res.json([...store.sleepEntries].sort((a, b) => b.date.localeCompare(a.date)));
  });

  app.post('/api/sleep', (req, res) => {
    const entry: SleepEntry = {
      id: uid(),
      date: req.body.date || new Date().toISOString().slice(0, 10),
      quality: req.body.quality ?? 3,
      bedtime: req.body.bedtime,
      wakeTime: req.body.wakeTime,
      moodOnWake: req.body.moodOnWake,
      notes: req.body.notes,
      createdAt: new Date().toISOString(),
    };
    store.sleepEntries.unshift(entry);
    persist();
    res.status(201).json(entry);
  });

  app.delete('/api/sleep/:id', (req, res) => {
    const idx = store.sleepEntries.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Entry not found' });
    store.sleepEntries.splice(idx, 1);
    persist();
    res.status(204).end();
  });

  // ── Tags ────────────────────────────────────────────────────────────────

  app.get('/api/tags', (_req, res) => res.json(store.tags));

  app.post('/api/tags', (req, res) => {
    const exists = store.tags.find(t => t.name.toLowerCase() === (req.body.name || '').toLowerCase());
    if (exists) return res.status(200).json(exists);
    const tag: DreamTag = {
      id: uid(),
      name: req.body.name,
      color: req.body.color || '#d3bbff',
      createdAt: new Date().toISOString(),
    };
    store.tags.unshift(tag);
    persist();
    res.status(201).json(tag);
  });

  app.delete('/api/tags/:id', (req, res) => {
    const idx = store.tags.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Tag not found' });
    const removed = store.tags.splice(idx, 1)[0];
    for (const d of store.dreams) {
      if (Array.isArray(d.tags)) d.tags = d.tags.filter((n: string) => n !== removed.name);
    }
    persist();
    res.status(204).end();
  });

  // ── Health check ────────────────────────────────────────────────────────

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      dreams: store.dreams.length,
      sleepEntries: store.sleepEntries.length,
      tags: store.tags.length,
      hasSynthesis: store.synthesis !== null,
      hasProfile: store.userProfile !== null,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dreamcatcher API at http://localhost:${PORT}`);
    console.log(`Store: ${STORE_PATH}`);
  });
}

startServer();
