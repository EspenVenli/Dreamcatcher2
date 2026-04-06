import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Mock database for dreams and synthesis
  let dreams: any[] = [];
  let synthesis: any = null;

  // API Routes
  app.get('/api/dreams', (req, res) => {
    res.json(dreams);
  });

  app.post('/api/dreams', (req, res) => {
    const newDream = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    dreams.unshift(newDream);
    res.json(newDream);
  });

  app.get('/api/synthesis', (req, res) => {
    res.json(synthesis);
  });

  app.post('/api/synthesis', (req, res) => {
    synthesis = {
      ...req.body,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    res.json(synthesis);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
