import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function predictTitle(
  firstMessage: string
): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "this is the first message from user. take this message and generate title. your title should be short and precise. it should be 5 words or less. your response will be directly used as title. if no context in message(such as greeting or others) then just title it as 'Chat'. the message is: " +
      firstMessage,
  });
  return response.text;
}
