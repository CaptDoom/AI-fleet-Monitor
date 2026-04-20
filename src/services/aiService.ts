import { GoogleGenAI, Type } from "@google/genai";
import { redactPII } from "./governanceService";

// Initialize Gemini for semantic routing
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface FleetExecutionResult {
  success: boolean;
  provider: string;
  model: string;
  content: string;
  wasRedacted: boolean;
  logs: string[];
  latency: string;
  cost: number;
}

export const executeFleetAction = async (
  prompt: string, 
  difficulty: 'simple' | 'complex', 
  forceFailover: boolean = false
): Promise<FleetExecutionResult> => {
  try {
    const response = await fetch('/api/v1/fleet/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, difficulty, forceFailover })
    });

    if (!response.ok) {
      throw new Error(`Fleet Proxy returned status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fleet Proxy Request Failed:", error);
    return {
      success: false,
      provider: "None",
      model: "None",
      content: "CRITICAL: Unable to reach Fleet Command. Gateway connection interrupted.",
      wasRedacted: false,
      logs: [`[ERROR] ${error.message}`],
      latency: "0ms",
      cost: 0
    };
  }
};

export const judgeDifficulty = async (prompt: string): Promise<'simple' | 'complex'> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following prompt and return a JSON object with a single key "difficulty" whose value is either "simple" (creative, casual, basic Q&A) or "complex" (logic, coding, math, reasoning). \n\nPrompt: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            difficulty: { type: Type.STRING, enum: ["simple", "complex"] }
          },
          required: ["difficulty"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"difficulty":"simple"}');
    return result.difficulty;
  } catch (error) {
    console.warn("Difficulty Judging Fault, defaulting to simple.", error);
    return 'simple';
  }
};
