import { useDispatch } from "react-redux";
import { getSocket} from "../service/chat.socket.js";
import { initChat, getChats, getMessages } from "../service/chat.api.js";
import {
  setError,
  setLoading,
  setChats,
  setCurrentChatId,
  addMessages,
  addNewMessage,
  createNewChat,
  addStreamingMessage,
  appendStreamChunk,
  finalizeAiMessage,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  // ── MAIN: send a message (handles both new chat and follow-up)
  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // ── Step 1: HTTP call → creates chat if needed, saves user message
      // Returns { chatId, title } immediately (no AI wait!)
      const { chatId: resolvedChatId, title } = await initChat({ message, chatId });

      // ── Step 2: Update Redux with chat + user message right away
      dispatch(createNewChat({ chatId: resolvedChatId, title }));
      dispatch(addNewMessage({ chatId: resolvedChatId, content: message, role: "user" }));
      dispatch(setCurrentChatId(resolvedChatId));

      // ── Step 3: Add an empty AI message placeholder ("Thinking...")
      dispatch(addStreamingMessage({ chatId: resolvedChatId }));
      dispatch(setLoading(false)); // stop the global spinner; streaming takes over

      // ── Step 4: Open socket and start streaming
      const socket = getSocket();

      // Clean up any old listeners first (important to avoid duplicate handlers
      // if the user sends multiple messages quickly)
      socket.off("chat:chunk");
      socket.off("chat:stream_end");
      socket.off("chat:error");

      // Tell the backend to start streaming for this chatId
      socket.emit("chat:start_stream", { chatId: resolvedChatId });

      // ── Step 5a: Receive chunks → keep appending to the AI placeholder
      socket.on("chat:chunk", ({ chatId: incomingChatId, chunk }) => {
        dispatch(appendStreamChunk({ chatId: incomingChatId, chunk }));
      });

      // ── Step 5b: Stream finished → finalise the message in Redux
      socket.on("chat:stream_end", ({ chatId: incomingChatId }) => {
        dispatch(finalizeAiMessage({ chatId: incomingChatId }));
        socket.off("chat:chunk");
        socket.off("chat:stream_end");
        socket.off("chat:error");
      });

      // ── Step 5c: Handle errors gracefully
      socket.on("chat:error", ({ chatId: incomingChatId, message: errMsg }) => {
        dispatch(finalizeAiMessage({ chatId: incomingChatId })); // stop "Thinking..."
        dispatch(setError(errMsg));
        socket.off("chat:chunk");
        socket.off("chat:stream_end");
        socket.off("chat:error");
      });

      return resolvedChatId; // Home.jsx uses this to navigate

    } catch (err) {
      dispatch(setError(err.message || "Something went wrong"));
      dispatch(setLoading(false));
    }
  }

  // ── Load messages for a chat (called by ChatPage on mount)
  async function handleOpenChat(chatId, chats) {
    if (!chats || chats?.messages.length === 0) {
      const data = await getMessages(chatId);
      const formattedMessages = data.messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(createNewChat({ chatId, title: data.title || "Chat" }));
      dispatch(addMessages({ chatId, messages: formattedMessages }));
    }
    dispatch(setCurrentChatId(chatId));
  }

  // ── Load all chats for the sidebar
  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    dispatch(
      setChats(
        data.chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {})
      )
    );
    dispatch(setLoading(false));
  }

  async function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
  };
};