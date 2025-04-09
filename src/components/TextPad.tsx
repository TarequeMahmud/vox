"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import askGemini from "@/api/askGemini";
import { useChat } from "@/contexts/ChatContext";
import { redirect } from "next/navigation";

const TextPad = () => {
  const { addMessage } = useChat();
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    addMessage({ role: "user", content: input });
    setInput("");
    const res = await askGemini(input);
    addMessage({ role: "ai", content: res });
    redirect("/chat/2");
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
        onClick={send}
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
