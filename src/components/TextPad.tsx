"use client";
import { useState } from "react";
import Image from "next/image";
import { useChat } from "@/contexts/ChatContext";
import { useRouter } from "next/navigation";

import { askGeminiStream } from "@/lib/stream/askGeminiStream";

const TextPad = () => {
  const router = useRouter();
  const { addMessage, streamAiResponse } = useChat();
  const [input, setInput] = useState("");
  const redirectTo = async (path: string): Promise<void> => router.push(path);

  const send = async () => {
    if (!input.trim()) return;

    addMessage({ role: "user", content: input });
    setInput("");

    const aiResponse: ChatMessage = { role: "ai", content: "" };
    addMessage(aiResponse);
    await askGeminiStream(input, (chunk) => {
      streamAiResponse((prevMessage) => ({
        ...prevMessage,
        content: prevMessage.content + chunk,
      }));
    });
  };

  const handleSubmit = async () => {
    if (window.location.pathname === "/") {
      redirectTo("/chat/2");
    }
    await send();
  };

  return (
    <div className="relative w-[80%] h-[130px] max-w-[800px] mb-4">
      <textarea
        className="bg-white border-3 border-[#cacaca] w-full h-full rounded-3xl resize-none p-4 pr-12"
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <button
        className="absolute bottom-3 right-3 bg-transparent p-2 cursor-pointer"
        onClick={handleSubmit}
      >
        <Image
          src="/send.png"
          alt="send to vox"
          height={24}
          width={24}
          className="mr-1"
          unoptimized
        />
      </button>
    </div>
  );
};

export default TextPad;
