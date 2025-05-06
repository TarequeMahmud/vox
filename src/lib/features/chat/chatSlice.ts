import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const initialState: ChatState = {
  messages: [],
};
const AIResponseStarter: ChatMessage = { role: "model", content: "" };

const chatsSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);

      state.messages.push(AIResponseStarter);
    },
    addMessageArray: (state, action) => {
      state.messages = action.payload;
    },
    streamAIResponse: (
      state,
      action: PayloadAction<ChatMessage["content"]>
    ) => {
      const msgLen = state.messages.length;
      if (msgLen > 0) {
        state.messages[msgLen - 1].content += action.payload;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const selectAllMessages = (state: RootState) => state.chat.messages;
export const { addMessage, streamAIResponse, addMessageArray, clearMessages } =
  chatsSlice.actions;

export default chatsSlice.reducer;
