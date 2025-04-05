import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "  AIzaSyAwO-ZyN4OAtDXlJgKS62fjsgIvUiz44VY",
});

export default async function askGemini(message: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${message}`,
  });
  return response.text || "No response";
}
