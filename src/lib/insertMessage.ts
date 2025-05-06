import axios from "axios";

export const insertMessage = async (
  userMessage: InsertMessagePayload<"user">,
  modelMessage: InsertMessagePayload<"model">,
  chatId: string
): Promise<void> => {
  try {
    await axios.post(`/api/chats/${chatId}/messages`, {
      userMessage,
      modelMessage,
    });
  } catch (error) {
    console.error("Error inserting message:", error);
    throw error;
  }
};
