import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { calculateChart } from './astroCalc.js';

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

  // ── Astrology ───────────────────────────────────────────────────────────

  /**
   * POST /api/astrology/calculate
   * Body: { date: "YYYY-MM-DD", time?: "HH:MM", place: string }
   * Geocodes the place via Nominatim, then calculates the full birth chart.
   */
  app.post('/api/astrology/calculate', async (req, res) => {
    const { date, time, place } = req.body as { date: string; time?: string; place: string };
    if (!date || !place) {
      return res.status(400).json({ error: 'date and place are required' });
    }

    // Geocode via Nominatim (free, no key required)
    let lat: number, lng: number, geocodedPlace: string;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'Dreamcatcher/1.0 (dreamcatcher-app)' } },
      );
      const geoData = await geoRes.json() as any[];
      if (!geoData?.length) {
        return res.status(400).json({ error: `Could not find location: "${place}". Try a city name.` });
      }
      lat = parseFloat(geoData[0].lat);
      lng = parseFloat(geoData[0].lon);
      geocodedPlace = geoData[0].display_name;
    } catch (err) {
      return res.status(500).json({ error: 'Geocoding failed. Check your internet connection.' });
    }

    // Parse birth date/time
    const [year, month, day] = date.split('-').map(Number);
    const hasTime = !!time;
    let hour = 12, minute = 0;
    if (time) {
      [hour, minute] = time.split(':').map(Number);
    }
    const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    try {
      const chart = calculateChart(birthDate, lat, lng, hasTime);
      res.json({ chart, lat, lng, geocodedPlace });
    } catch (err) {
      console.error('Chart calculation error:', err);
      res.status(500).json({ error: 'Chart calculation failed.' });
    }
  });

  // ── AI Endpoints ─────────────────────────────────────────────────────────────

  /** POST /api/dreams/analyze */
  app.post('/api/dreams/analyze', async (req, res) => {
    const { transcript, userProfile: profile } = req.body as { transcript: string; userProfile?: unknown };
    if (!transcript) return res.status(400).json({ error: 'transcript is required' });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'AI not configured' });
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Analyze this dream transcript carefully. Use ONLY the content of the transcript — do not invent details. Provide a title, cleaned narrative, analysis, lucidity, symbols, and emotional resonance scores.\n${profile ? `User context: ${JSON.stringify(profile)}\n` : ''}Transcript: ${transcript}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              cleanedContent: { type: Type.STRING },
              analysis: { type: Type.STRING },
              lucidity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              symbols: { type: Type.ARRAY, items: { type: Type.STRING } },
              resonance: {
                type: Type.OBJECT,
                properties: {
                  calm: { type: Type.NUMBER },
                  awe: { type: Type.NUMBER },
                  fear: { type: Type.NUMBER },
                },
              },
            },
            required: ['title', 'cleanedContent', 'analysis', 'lucidity', 'symbols', 'resonance'],
          },
        },
      });
      res.json(JSON.parse(response.text));
    } catch (err) {
      console.error('Dream analysis error:', err);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  /** POST /api/synthesis/generate */
  app.post('/api/synthesis/generate', async (req, res) => {
    const { userProfile: profile } = req.body as { userProfile?: unknown };
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'AI not configured' });
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Generate a weekly dream synthesis.\nUser Profile: ${JSON.stringify(profile)}\nRecent Dreams: ${JSON.stringify(dreams.slice(0, 10))}\n\nProvide: headline, patterns (with icons Waves/Key/Sparkles/Moon/Sun/Wind), celestialAlignment, shadowWork, collectiveWhisper (an evocative message from the collective subconscious), moodscape (title, imageUrl placeholder, 3 hex colors).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              patterns: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, frequency: { type: Type.NUMBER }, icon: { type: Type.STRING } } } },
              celestialAlignment: { type: Type.STRING },
              shadowWork: { type: Type.STRING },
              collectiveWhisper: { type: Type.STRING },
              moodscape: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, imageUrl: { type: Type.STRING }, colors: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            },
            required: ['headline', 'patterns', 'celestialAlignment', 'shadowWork', 'collectiveWhisper', 'moodscape'],
          },
        },
      });
      const result = JSON.parse(response.text);
      if (!result.moodscape.imageUrl?.startsWith('http')) {
        result.moodscape.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(result.moodscape.title)}/800/600?blur=2`;
      }
      synthesis = { ...result, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), createdAt: new Date().toISOString() };
      res.json(synthesis);
    } catch (err) {
      console.error('Synthesis error:', err);
      res.status(500).json({ error: 'Synthesis generation failed' });
    }
  });

  /** POST /api/mirror/chat */
  app.post('/api/mirror/chat', async (req, res) => {
    const { message, history, userProfile: profile } = req.body as { message: string; history: { role: string; text: string }[]; userProfile?: unknown };
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'AI not configured' });
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const ctx = `You are The Mirror — a deeply personal, poetic oracle within the Dreamcatcher app. Speak with calm, grounded wisdom, lyrical depth, and precise emotional intelligence.\n\nEvery response is rooted in this specific person's dream history and profile. Be specific — reference their actual dreams, symbols, emotions. Never generalize. Never say you are an AI.\n\nUSER PROFILE:\n${JSON.stringify(profile, null, 2)}\n\nDREAM HISTORY (${dreams.length} dreams):\n${JSON.stringify(dreams.slice(0, 15), null, 2)}\n\nCONVERSATION:\n${(history ?? []).map((m) => `${m.role === 'user' ? 'You' : 'Mirror'}: ${m.text}`).join('\n')}\n\nUser asks: ${message}\n\nRespond as The Mirror. 2–4 short paragraphs. Second person. End with one quiet, open question.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: ctx });
      res.json({ text: response.text ?? 'The mirror is silent for now...' });
    } catch (err) {
      console.error('Mirror error:', err);
      res.status(500).json({ error: 'Mirror unavailable' });
    }
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dreamcatcher API at http://localhost:${PORT}`);
  });
}

startServer();
