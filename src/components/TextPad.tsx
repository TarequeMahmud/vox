"use client";
import { useState } from "react";
import Image from "next/image";
import { useChat } from "@/contexts/ChatContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { askGeminiStream } from "@/lib/stream/askGeminiStream";
import useLoader from "@/hooks/useLoader";

const TextPad = () => {
  const router = useRouter();
  const { addMessage, streamAiResponse } = useChat();
  const { loading, showLoader, hideLoader } = useLoader();

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
    showLoader();
    if (window.location.pathname === "/") {
      try {
        const response = await axios.post("/api/chats", {
          firstMessage: input,
        });
        if (response.status === 201) {
          await redirectTo(`/chat/${response.data.chat_id}`);
        }
      } catch (error) {
        console.error("There was an error!", error);
        hideLoader();
      }
    }
    await send();
    hideLoader();
  };

  return (
    <div className="relative w-[80%] h-[130px] max-w-[800px] mb-4">
      <textarea
        className="bg-white border-3 border-[#cacaca] w-full h-full rounded-3xl resize-none p-4 pr-12"
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      ></textarea>

      <button
        className={`absolute bottom-3 right-3 bg-transparent p-2 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleSubmit}
      >
        {loading ? (
          <Spinner color="border-gray-950" />
        ) : (
          <Image
            src="/send.png"
            alt="send to vox"
            height={24}
            width={24}
            className="mr-1 "
            unoptimized
          />
        )}
      </button>
    </div>
  );
};

export default TextPad;
