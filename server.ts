import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// In-memory store (replace with a real DB + migration runner in production)
// ---------------------------------------------------------------------------

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

let dreams: any[] = [];
let synthesis: any = null;
let userProfile: UserProfileStore | null = null;

// ---------------------------------------------------------------------------

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // ── Dreams ──────────────────────────────────────────────────────────────

  /** GET /api/dreams — list all dreams, newest first */
  app.get('/api/dreams', (_req, res) => {
    res.json(dreams);
  });

  /** POST /api/dreams — save a new dream */
  app.post('/api/dreams', (req, res) => {
    const newDream = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }),
      createdAt: new Date().toISOString(),
    };
    dreams.unshift(newDream);
    res.status(201).json(newDream);
  });

  /** GET /api/dreams/:id — fetch a single dream */
  app.get('/api/dreams/:id', (req, res) => {
    const dream = dreams.find(d => d.id === req.params.id);
    if (!dream) return res.status(404).json({ error: 'Dream not found' });
    res.json(dream);
  });

  /** DELETE /api/dreams/:id — delete a dream */
  app.delete('/api/dreams/:id', (req, res) => {
    const idx = dreams.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Dream not found' });
    dreams.splice(idx, 1);
    res.status(204).end();
  });

  /** PATCH /api/dreams/:id — update fields (e.g. favourite, notes) */
  app.patch('/api/dreams/:id', (req, res) => {
    const idx = dreams.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Dream not found' });
    dreams[idx] = { ...dreams[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json(dreams[idx]);
  });

  // ── Weekly Synthesis ────────────────────────────────────────────────────

  /** GET /api/synthesis — fetch current weekly synthesis */
  app.get('/api/synthesis', (_req, res) => {
    res.json(synthesis);
  });

  /** POST /api/synthesis — save / replace weekly synthesis */
  app.post('/api/synthesis', (req, res) => {
    synthesis = {
      ...req.body,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }),
      createdAt: new Date().toISOString(),
    };
    res.status(201).json(synthesis);
  });

  // ── User Profile ────────────────────────────────────────────────────────

  /** GET /api/user/profile — fetch user profile */
  app.get('/api/user/profile', (_req, res) => {
    res.json(userProfile);
  });

  /** POST /api/user/profile — create or fully replace profile */
  app.post('/api/user/profile', (req, res) => {
    userProfile = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.status(201).json(userProfile);
  });

  /** PATCH /api/user/profile — partial update */
  app.patch('/api/user/profile', (req, res) => {
    if (!userProfile) {
      userProfile = { updatedAt: new Date().toISOString() };
    }
    userProfile = {
      ...userProfile,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(userProfile);
  });

  // ── Health check ────────────────────────────────────────────────────────

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      dreams: dreams.length,
      hasSynthesis: synthesis !== null,
      hasProfile: userProfile !== null,
    });
  });

  // ── Vite / static serving ───────────────────────────────────────────────

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dreamcatcher server running on http://localhost:${PORT}`);
  });
}

startServer();
