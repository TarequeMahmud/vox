"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };
  const streamAiResponse = (updater: (prev: ChatMessage) => ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = updater(updated[lastIndex]);
      return updated;
    });
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, streamAiResponse }}>
      {children}
    </ChatContext.Provider>
  );
};
