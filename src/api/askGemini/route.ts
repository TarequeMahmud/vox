import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: " AIzaSyAwO-ZyN4OAtDXlJgKS62fjsgIvUiz44VY",
});

export async function POST(req: Request): Promise<NextResponse> {
  const { message } = await req.json();
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: `${message}`,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        controller.enqueue(encoder.encode(chunk.text));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

/*


const reader = stream.getReader();

reader.read().then(function processText({ done, value }) {
  if (done) {
    console.log('Stream complete');
    return;
  }

  console.log(value);
  return reader.read().then(processText);
});
*/
