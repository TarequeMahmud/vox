"use client";
import { useState } from "react";
import Image from "next/image";
import {
  addMessage,
  selectAllMessages,
  streamAIResponse,
} from "@/lib/features/chat/chatSlice";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { askgemini } from "@/lib/askgemini";
import useLoader from "@/hooks/useLoader";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import generateHistory from "@/lib/generateHistory";
import { insertMessage } from "@/lib/insertMessage";

//TextPad Component
const TextPad = ({ setLastChat }: Pick<LastChatProps, "setLastChat">) => {
  const params = useParams();
  let chatId = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const history = useAppSelector(selectAllMessages);
  const { loading, showLoader, hideLoader } = useLoader();

  const [input, setInput] = useState("");
  const redirectTo = async (path: string): Promise<void> => router.push(path);

  const send = async () => {
    if (!input.trim()) return;
    dispatch(addMessage({ role: "user", content: input }));
    setInput("");
    const fullText = await askgemini(input, generateHistory(history), (chunk) =>
      dispatch(streamAIResponse(chunk))
    );
    return fullText;
  };

  const handleSubmit = async () => {
    showLoader();
    const uuid = crypto.randomUUID();
    const isHome = window.location.pathname === "/";
    const temporary = window.location.pathname === "/chat/temporary";
    const isNewChat = isHome && !temporary;
    let chatId = uuid;
    if (isNewChat) {
      await redirectTo(`/chat/${uuid}?new=true`);
    }
    const fullResponse = await send();
    hideLoader();

    if (!temporary) {
      try {
        if (isHome) {
          const response = await axios.post("/api/chats", {
            firstMessage: input,
            chatId: uuid,
          });
          if (response.status === 201) {
            setLastChat(response.data.chatResponse);
          }
        }
      } catch (error) {
        console.error("There was an error!", error);
        hideLoader();
      }
      await insertMessage(
        { text: input, role: "user" },
        { text: fullResponse!, role: "model" },
        chatId
      );
    }
  };

  return (
    <div className="relative w-[80%] md:h-[130px] max-w-[800px] mb-4">
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
