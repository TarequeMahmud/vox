"use client";

import { useChat } from "@/contexts/ChatContext";
import clsx from "clsx";
import MarkdownResponse from "./MarkdownResponse";
const ChatShower = () => {
  const { messages } = useChat();
  return (
    <>
      {[...messages].reverse().map((message, index) => (
        <div
          key={index}
          className={clsx("flex w-full flex-row", {
            "justify-end": message.role === "user",
          })}
        >
          <div
            className={clsx(
              "h-auto min-h-10   m-4 rounded-[10px] text-start py-2 px-5 text-lg",
              {
                "bg-[#BBF4FF] w-auto": message.role === "user",
                "w-[90%]": message.role === "ai",
              }
            )}
          >
            <MarkdownResponse markdown={message.content} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatShower;
