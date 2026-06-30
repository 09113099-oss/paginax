import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/generate-questions', async (req, res) => {
    try {
      const { theme, audience, level, mandatory } = req.body;

      const prompt = `Você é um Game Designer especialista em gamificação educacional. Crie 20 perguntas para um jogo interativo de "Roleta do Conhecimento".
      Tema da Roleta: ${theme}
      Público-alvo: ${audience}
      Nível de Conhecimento: ${level}
      Conteúdos Obrigatórios: ${mandatory}

      REGRAS DE DIFICULDADE:
      Você DEVE criar EXATAMENTE 20 perguntas, alternando as dificuldades ESTRITAMENTE nesta ordem: Fácil, Média, Difícil, Fácil, Média, Difícil... (repetindo o ciclo).
      - Fácil: Exige apenas lembrança.
      - Média: Exige compreensão e aplicação.
      - Difícil: Exige análise e resolução de problemas.

      PONTUAÇÕES E PENALIDADES:
      - Fácil: points: 10, penalty: 0
      - Média: points: 20, penalty: 10
      - Difícil: points: 40, penalty: 20

      RECURSOS DE AJUDA (help):
      - Fácil: Deixe como null
      - Média: Escolha aleatoriamente UM destes: "Pedir uma dica para um colega", "Consultar uma anotação do caderno durante 30 segundos", "Eliminar uma alternativa incorreta"
      - Difícil: Escolha aleatoriamente UM destes: "Pedir ajuda para um colega durante 30 segundos", "Consultar o caderno por 1 minuto", "Receber uma dica do professor", "Pular a pergunta recebendo apenas metade da pontuação", "Pedir duas pistas (cada pista reduz 10 pontos)"

      FORMATOS DE PERGUNTA:
      Misture: Questões abertas, Múltipla escolha (escreva as alternativas na própria string da pergunta), Verdadeiro ou falso, Complete a frase, Situações-problema.`;

      const responseSchema: Schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.INTEGER, description: "Slot number 1 to 20" },
            difficulty: { type: Type.STRING, description: "Fácil, Média, or Difícil" },
            question: { type: Type.STRING, description: "The exact question text to ask the player" },
            answer: { type: Type.STRING, description: "The correct answer and a brief explanation" },
            format: { type: Type.STRING, description: "Format of the question (e.g., Múltipla escolha)" },
            points: { type: Type.INTEGER },
            penalty: { type: Type.INTEGER },
            help: { type: Type.STRING, nullable: true }
          },
          required: ["number", "difficulty", "question", "answer", "format", "points", "penalty"]
        }
      };

      const response = await getAIClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7
        }
      });

      const jsonText = response.text || '[]';
      const questions = JSON.parse(jsonText);
      res.json({ questions });
    } catch (error: any) {
      console.error('Error generating questions:', error);
      res.status(500).json({ error: error.message || 'Failed to generate questions' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

startServer();
