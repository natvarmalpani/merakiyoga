import { GoogleGenAI, Type } from "@google/genai";
import { AIRoutineResponse } from "../types.ts";

export const generateAsanaInfo = async (asanaName: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        console.error("API Key missing");
        return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
ROLE:
You are a yoga education content writer. Your task is to create accurate, safe, and SEO-friendly explanations of yoga asanas for a professional yoga website.

GOAL:
Explain ${asanaName} clearly and correctly using simple language.
Avoid exaggeration, medical claims, or unverified healing promises.
Content must be suitable for beginners and safe for public learning.

INSTRUCTIONS
For ${asanaName}, generate content using only the structure below.
Use clear headings. Keep sentences short. Be factual and cautious.

OUTPUT STRUCTURE (MANDATORY) In HTML FORMAT.
Use <h3> for section headers. Use <ul> and <li> for lists. Use <p> for paragraphs. Do not use <h1> or <h2>.
Wrap the "End Note" in a <div> with class="end-note".
Do NOT include \`\`\`html or markdown code blocks. Return RAW HTML only.

1. Asana Details
Sanskrit name
Common English name
Easy pronunciation
Type of pose (standing, seated, balance, backbend, twist, inversion, etc.)
Difficulty level (beginner / intermediate / advanced)

2. Overview
Brief description of the pose
What the posture looks like
Mention whether it is a traditional or modern posture if known

3. How to Practice (Step-by-Step)
Starting position
Clear steps in correct order
How to enter the pose
How to hold the pose
How to exit the pose safely
Use simple, precise instructions. Avoid vague words.

4. Breathing and Focus
When to inhale
When to exhale
Where to place attention (breath, balance, stretch, stability)

5. Body Involvement
Main body parts involved
Muscles or joints working
Areas being stretched or strengthened
Keep this factual and non-technical.

6. Benefits
Physical benefits
Mental or relaxation benefits
Use safe language such as:
“may help”
“supports”
“can improve with regular practice”
Do not claim cures or medical treatment.

7. Safety and Contraindications
Who should avoid this pose
Injuries or conditions requiring caution
Pregnancy or health-related warnings (if applicable)
This section is mandatory for every pose.

8. Modifications and Props
Easier options for beginners
Use of props (block, chair, wall, strap)
How to reduce strain or discomfort

9. Variations (Optional)
Beginner or advanced variations
Related or similar poses

10. Practice Tips
Suggested holding time
Number of repetitions (if relevant)
General practice advice

SEO RULES (MANDATORY)
Use the asana name naturally in headings
Keep language clear and searchable
Avoid keyword stuffing
Write for humans first, search engines second

SAFETY RULES (MANDATORY)
No medical advice or disease-specific claims
No promises of healing or cure
No spiritual or mystical exaggeration
Content is educational only

END NOTE (INCLUDE ALWAYS)
This content is for educational purposes only. Practice yoga under proper guidance if needed.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "text/plain", 
                systemInstruction: "You are a professional yoga education writer. Return ONLY clean HTML code. Do NOT wrap it in markdown code blocks."
            }
        });

        return response.text || null;

    } catch (error) {
        console.error("Error generating asana info:", error);
        return null;
    }
};

export const generateYogaRoutine = async (goal: string, duration: string, level: string): Promise<AIRoutineResponse | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Create a yoga routine for a ${level} practitioner focusing on ${goal}. The routine should be approximately ${duration}.`;

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert yoga instructor. Create safe, balanced, and effective yoga sequences."
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as AIRoutineResponse;
    }
    return null;

  } catch (error) {
    console.error("Error generating routine:", error);
    return null;
  }
};

export const chatWithYogaAI = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure your API Key to use the AI assistant.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are a knowledgeable and peaceful yoga philosopher and instructor. Answer questions about yoga philosophy, history, asana benefits, and contraindications briefly and warmly."
      }
    });
    return response.text || "I am meditating on that thought. Please try again.";
  } catch (error) {
    console.error("Chat error", error);
    return "Namaste. I am currently unavailable. Please try again later.";
  }
};