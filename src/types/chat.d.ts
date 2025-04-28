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

type ChatRow = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  date_group: "Today" | "Yesterday" | "Last 7 Days" | "Last 30 Days" | "Older";
};

type GroupedChats = {
  date_group: ChatRow["date_group"];
  chats: {
    id: string;
    title: string;
    created_at: string;
  }[];
};
