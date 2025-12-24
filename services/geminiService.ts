import { AIRoutineResponse } from "../types.ts";

/**
 * Client-side bridge to Vercel Serverless Functions.
 * This keeps the API Key entirely on the server.
 */
async function callGeminiFunction(payload: any) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to communicate with AI service");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

export const generateAsanaInfo = async (asanaName: string): Promise<string | null> => {
  try {
    const data = await callGeminiFunction({ action: "generateAsanaInfo", asanaName });
    return data.text;
  } catch (error) {
    return null;
  }
};

export const generateYogaRoutine = async (goal: string, duration: string, level: string): Promise<AIRoutineResponse | null> => {
  try {
    const data = await callGeminiFunction({ action: "generateYogaRoutine", goal, duration, level });
    return data.data;
  } catch (error) {
    return null;
  }
};

export const chatWithYogaAI = async (message: string): Promise<string> => {
  try {
    const data = await callGeminiFunction({ action: "chatWithYogaAI", message });
    return data.text;
  } catch (error) {
    return "Namaste. I am currently unavailable. Please try again later.";
  }
};