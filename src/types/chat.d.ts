type ChatMessage = {
  role: "user" | "model";
  content: string;
};

interface ChatState {
  messages: ChatMessage[];
}

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

type SingleChat = {
  date_group: ChatRow["date_group"];
  chat: {
    id: string;
    title: string;
    created_at: string;
  };
};

interface LastChatProps {
  lastChat: SingleChat | undefined;
  setLastChat: React.Dispatch<React.SetStateAction<SingleChat | undefined>>;
}
