type ChatMessage = {
  role: "user" | "ai";
  content: string;
};
type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
};

interface Props {
  markdown: string;
}
