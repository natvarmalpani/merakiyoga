import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Vercel Serverless Function Handler

  // Ensure only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "Server configuration error: API Key missing" });
  }

  // Use the process.env.API_KEY string directly when initializing the @google/genai client instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Vercel automatically parses JSON body if Content-Type is application/json
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { action } = body;

  try {
    switch (action) {
      case "generateAsanaInfo": {
        const { asanaName } = body;
        const prompt = `Explain ${asanaName} clearly and correctly using simple language. Return RAW HTML only. Use <h3> for headers, <ul> for lists. No markdown code blocks. Include an 'End Note' div with class 'end-note'.`;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            systemInstruction: "You are a professional yoga education writer. Return ONLY clean HTML code."
          }
        });
        return res.status(200).json({ text: response.text });
      }

      case "generateYogaRoutine": {
        const { goal, duration, level } = body;
        const prompt = `Create a yoga routine for a ${level} practitioner focusing on ${goal}. Duration: ${duration}.`;
        const schema = {
          type: Type.OBJECT,
          properties: {
            routineName: { type: Type.STRING },
            targetGoal: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  poseName: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                },
                required: ['poseName', 'duration', 'instruction']
              }
            }
          },
          required: ['routineName', 'targetGoal', 'steps']
        };
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            systemInstruction: "You are an expert yoga instructor."
          }
        });
        // Note: response.text is a stringified JSON
        return res.status(200).json({ data: JSON.parse(response.text) });
      }

      case "chatWithYogaAI": {
        const { message } = body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: message,
          config: {
            systemInstruction: "You are a knowledgeable and peaceful yoga philosopher. Answer briefly and warmly."
          }
        });
        return res.status(200).json({ text: response.text });
      }

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("Gemini Function Error:", error);
    return res.status(500).json({ error: error.message || "AI Generation failed" });
  }
}