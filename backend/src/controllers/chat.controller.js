import { generateResponseStream, generateChatTitle,  } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function chatInitController(req, res) {
  const { message, chatId } = req.body;
  const userId = req.user.id;
 
  let chat = null;
 
  // ── New chat: generate title + create chat document
  if (!chatId) {
    const aiTitle = await generateChatTitle(message);
    chat = await chatModel.create({ user: userId, title: aiTitle });
  } else {
    // Existing chat: just fetch it so we can return it
    chat = await chatModel.findById(chatId);
  }
 
  // ── Always save the user message immediately
  await messageModel.create({
    chat: chat._id,
    content: message,
    role: "user",
  });
 
  // ── Return chatId + title to frontend RIGHT AWAY
  // Frontend will then open a socket and say "start streaming for this chat"
  return res.status(201).json({
    chatId: chat._id,
    title: chat.title,
  });
}

export async function handleStreamSocket(socket, { chatId }) {
  try {
    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    let fullResponse = "";

    const stream = await generateResponseStream(messages);

    for await (const event of stream) {

      // ── Only these two event types carry actual AI text tokens
      // "on_chat_model_stream" → Gemini is typing a chunk
      // Skip "on_tool_start", "on_tool_end", "on_agent_action" etc.
      if (event.event !== "on_chat_model_stream") continue;

      const chunk = event.data?.chunk;
      if (!chunk) continue;

      // Gemini returns content as a string directly
      const text = typeof chunk.content === "string"
        ? chunk.content
        : chunk.content?.[0]?.text ?? ""; // fallback for array format

      if (!text) continue;

      fullResponse += text;
      socket.emit("chat:chunk", { chatId, chunk: text });
    }

    if (!fullResponse.trim()) {
      fullResponse = "Sorry, I couldn't generate a response.";
    }

    const aiMessage = await messageModel.create({
      chat: chatId,
      content: fullResponse,
      role: "ai",
    });

    socket.emit("chat:stream_end", {
      chatId,
      aiMessage: { content: aiMessage.content, role: aiMessage.role },
    });

  } catch (err) {
    console.error("Stream error:", err);
    socket.emit("chat:error", { chatId, message: "AI response failed." });
  }
}

export async function getAllChatsController(req, res) {
    try {
        const userId = req.user.id;

        const chats = await chatModel.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "all chats feteched Successfully",
            chats
        })

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "error while fetching messages" });
    }

}

export async function getUserMessageController(req, res) {
    try {

        const userId = req.user.id;
        const chatId = req.params.chatId;

        const chats = await chatModel.findOne({
            _id: chatId,
            user: userId
        })

        if (!chats) return res.status(404).json({ message: "Chat not found" })

        const messages = await messageModel.find({
            chat: chatId
        })

        return res.status(200).json({
            message: "Messages feteched ",
            messages
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "error while fetching messages" });
    }
}

export async function deleteChatController(req, res) {
    try {

        const userId = req.user.id;
        const chatId = req.params.chatId;

        const chats = await chatModel.findOneAndDelete({ user: userId, _id: chatId });

        if (!chats) return res.status(404).json({ message: "No chats found" });

        await messageModel.deleteMany({
            chat: chatId
        })

        return res.status(200).json({ message: "Chat deleted" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error while deleting messages" });
    }
}
