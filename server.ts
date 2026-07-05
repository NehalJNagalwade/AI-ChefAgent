import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  // This uses the official @google/genai SDK to connect to the Gemini models.
  // We keep this on the server-side to ensure the API key remains secure and is never exposed to the client.
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Chat endpoint
  // This endpoint handles the multi-turn conversational state of the concierge agent.
  app.post("/api/chat", async (req, res) => {
    try {
      // The frontend sends the entire conversational history to maintain state context
      const { history, message } = req.body;
      
      // System Instructions dictate the agentic behavior of ChefAgent.
      // It instructs the model to guide the user step-by-step rather than dumping a recipe,
      // simulating a true interactive concierge experience.
      const systemInstruction = `You are ChefAgent, a highly skilled and friendly personal culinary concierge. 
Your goal is to help users reduce food waste by cooking delicious meals with ingredients they already have in their fridge or pantry.

Follow these strict rules:
1. GREETING & DISCOVERY: If it's the start of the conversation, enthusiastically ask what ingredients they have, any dietary restrictions, and how much time they have to cook.
2. IDEATION: Based on their ingredients, suggest 2-3 creative recipe ideas. Keep the descriptions appetizing but brief. Ask them which one they want to make.
3. STEP-BY-STEP GUIDANCE: Once they choose a recipe, DO NOT give them the entire recipe at once. This is overwhelming.
   - Give them the prep steps first (washing, chopping). 
   - Wait for them to say "done", "next", or "ready" before giving the next step.
   - Guide them through the cooking process one step at a time.
4. TROUBLESHOOTING: If they make a mistake (e.g., "I burned the onions", "I don't have enough salt"), offer immediate, calm solutions or substitutes.
5. TONE: Be encouraging, enthusiastic, and concise. Use emojis sparingly but effectively.
`;

      // Convert frontend history to GenAI SDK format
      const formattedHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...formattedHistory, { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
