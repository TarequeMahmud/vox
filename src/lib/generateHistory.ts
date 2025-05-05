const generateHistory = (state: ChatMessage[]): MessageHistoryContent[] => {
  return state.map((message) => ({
    role: message.role,
    parts: [{ text: message.content }],
  }));
};
export default generateHistory;
