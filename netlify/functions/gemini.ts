
import { GoogleGenAI, Type } from "@google/genai";
//console.log("API_KEY exists:", !!process.env.API_KEY);

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  if (!process.env.API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error: API Key missing" }),
    };
  }

  // Use the process.env.API_KEY string directly when initializing the @google/genai client instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const body = JSON.parse(event.body);
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
        return { statusCode: 200, body: JSON.stringify({ text: response.text }) };
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
        return { statusCode: 200, body: JSON.stringify({ data: JSON.parse(response.text) }) };
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
        return { statusCode: 200, body: JSON.stringify({ text: response.text }) };
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid action" }) };
    }
  } catch (error: any) {
    console.error("Gemini Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "AI Generation failed" }),
    };
  }
};
