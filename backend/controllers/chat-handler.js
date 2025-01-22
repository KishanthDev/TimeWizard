import Chat from "../models/chat-model.js";
import { ObjectId } from "mongodb";

const chatHandler = (io, socket) => {
  // Join a project room
  socket.on("joinRoom", ({ projectId, userId }) => {
    socket.join(projectId);
    console.log(`User ${userId} joined room ${projectId}`);
  });

  // Handle messages
  socket.on("sendMessage", async ({ projectId, message }) => {
    const { text, userId } = message;

    if (!text.trim()) {
      console.log("Empty message. Skipping save.");
      return;
    }

    // Broadcast message to the room
    io.to(projectId).emit("receiveMessage", {
      text,
      userId,
      timestamp: new Date(),
    });

    try {
      const projectObjectId = new ObjectId(projectId);
      const userObjectId = new ObjectId(userId);

      const chatMessage = new Chat({
        projectId: projectObjectId,
        userId: userObjectId,
        text,
      });

      await chatMessage.save();
      console.log("Message saved to DB:", chatMessage);
    } catch (error) {
      console.error("Error saving message to DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

export default chatHandler;
