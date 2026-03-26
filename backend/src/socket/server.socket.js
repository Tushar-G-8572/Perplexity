import {Server} from 'socket.io';
import {handleStreamSocket} from '../controllers/chat.controller.js'

let io;

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin:"http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
 
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);
 
    // ── Frontend emits this after the HTTP call succeeds
    // Payload: { chatId: "..." }
    socket.on("chat:start_stream", async (payload) => {
      console.log("▶️  Start stream for chatId:", payload.chatId);
 
      // Delegate all streaming logic to the controller
      await handleStreamSocket(socket, payload);
    });
 
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
 
  return io;
}
 
export function getIO() {
  if (!io) throw new Error("Socket.IO not initialised yet");
  return io;
}