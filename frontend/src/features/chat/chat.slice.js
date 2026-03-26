import { createSlice } from "@reduxjs/toolkit";
 
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title,
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    },
 
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
    },
 
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      // Avoid duplicating messages if already loaded
      if (state.chats[chatId].messages.length === 0) {
        state.chats[chatId].messages.push(...messages);
      }
    },
 
    // ── NEW: push an empty AI placeholder so UI shows "Thinking..."
    addStreamingMessage: (state, action) => {
      const { chatId } = action.payload;
      state.chats[chatId].messages.push({
        role: "ai",
        content: "",
        isStreaming: true, // UI uses this to show a blinking cursor / skeleton
      });
    },
 
    // ── NEW: called for every socket chunk → appends text to last message
    appendStreamChunk: (state, action) => {
      const { chatId, chunk } = action.payload;
      const messages = state.chats[chatId]?.messages;
      if (!messages) return;
      const last = messages[messages.length - 1];
      if (last?.isStreaming) {
        last.content += chunk; // streaming in!
      }
    },
 
    // ── NEW: called when stream_end arrives → mark streaming finished
    finalizeAiMessage: (state, action) => {
      const { chatId } = action.payload;
      const messages = state.chats[chatId]?.messages;
      if (!messages) return;
      const last = messages[messages.length - 1];
      if (last?.isStreaming) {
        last.isStreaming = false;
      }
    },
 
    setChats: (state, action) => {
      state.chats = action.payload;
    },
 
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
 
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
 
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});
 
export const {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addMessages,
  addNewMessage,
  addStreamingMessage,
  appendStreamChunk,
  finalizeAiMessage,
} = chatSlice.actions;
 
export default chatSlice.reducer;