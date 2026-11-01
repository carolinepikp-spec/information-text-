import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// AI-assisted proofreading endpoint
app.post('/api/proofread', async (req, res) => {
  try {
    const { text, sectionName } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.json({ issues: [] });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Gracefully fall back to client-side rule checks if API key is unconfigured
      return res.json({ 
        issues: [],
        note: 'API key not configured for AI proofreading. Client-side rules are active.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a helpful student proofreading assistant. Analyze the following student text from section "${sectionName || 'Report'}".
Identify any spelling errors, grammar mistakes, repeated words, incorrect capitalization, or punctuation issues.
Do NOT rewrite the student's text. Do NOT add new examples.
Return ONLY valid JSON in this exact structure:
{
  "issues": [
    {
      "original": "the exact misspelled or grammatically wrong word or short phrase",
      "suggestion": "the correct replacement",
      "type": "spelling" | "grammar" | "punctuation",
      "explanation": "brief, encouraging explanation suitable for a student"
    }
  ]
}

Student text to inspect:
"""${text}"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{"issues": []}';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { issues: [] };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Proofread error:', error);
    res.status(500).json({ error: error.message || 'Proofread failed', issues: [] });
  }
});

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
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
