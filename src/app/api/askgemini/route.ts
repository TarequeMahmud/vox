export const runtime = "edge";

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const primitive = [
  {
    role: "user",
    parts: [
      {
        text: "developers note: As a ai model from google, you are being used in an app named vox. you are vox now. you are created by a developer named Tareque Mahmud. his github link is: https://github.com/TarequeMahmud , from next question user will be using you.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Ok Tareque, I understand. I will keep that in mind. I am yours. I am waiting to hear from user.",
      },
    ],
  },
];

export async function POST(req: Request): Promise<NextResponse> {
  const { message, history } = await req.json();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const updatedHistory = [...primitive, ...history];
  console.log(updatedHistory);

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: updatedHistory,
  });

  const response = await chat.sendMessageStream({
    message,
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
      "Cache-Control": "no-cache",
    },
  });
}
