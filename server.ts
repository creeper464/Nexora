import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Assistant endpoint for NEXORA
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { prompt, mode, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // Fallback response if key is not yet configured
      return res.json({
        response: `⚡ [NEXORA SPARK CREATIVE]: Here are top suggestions for "${prompt}":\n\n1. "POV: You discovered this before it blew up..." (High retention hook)\n2. "The one thing nobody is talking about in 2026..." (Curiosity gap)\n3. Fast-paced visual cut with trending bass drop.\n\nRecommended tags: #NexoraViral #Nexora2026 #TrendingNow`,
        mock: true,
      });
    }

    const systemInstruction = `You are "NEXORA SPARK", the high-energy, cutting-edge AI creative copilot built directly into NEXORA — the ultimate social entertainment platform (Slogan: Connect • Create • Discover). 
Your style is bold, punchy, trend-savvy, and direct. You help creators write viral hooks, punchy reel captions, high-converting hashtag strategies, 3-part video scripts, trending audio pairings, and monetization growth tips. Keep responses formatted with clear bullet points, catchy hooks, and energetic vibes. Do not use corporate boring language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || 'Unable to generate suggestion at this time.';
    return res.json({ response: text });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Setup Vite middlewares for development, or static build for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`NEXORA server running on http://localhost:${PORT}`);
  });
}

startServer();
