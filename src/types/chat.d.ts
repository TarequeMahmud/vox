type ChatMessage = {
  role: "user" | "ai";
  content: string;
};
type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  streamAiResponse: (updater: (prev: ChatMessage) => ChatMessage) => void;
};

interface Props {
  markdown: string;
}
