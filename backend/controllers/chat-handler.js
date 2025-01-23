import Chat from "../models/chat-model.js";
import Project from "../models/project-model.js";
import { ObjectId } from "mongodb";

const chatHandler = (io, socket) => {
  socket.on("joinRoom", async ({ projectId, userId }) => {
    try {
      const projectObjectId = new ObjectId(projectId);
      const userObjectId = new ObjectId(userId);

      const project = await Project.findOne({
        _id: projectObjectId,
        teams: userObjectId, 
      });

      if (!project) {
        console.log(`Unauthorized access: User ${userId} tried to join room ${projectId}`);
        socket.emit("unauthorized", "You are not authorized to join this project.");
        return;
      }

      // User is authorized; join the room
      socket.join(projectId);
      console.log(`User ${userId} joined room ${projectId}`);
    } catch (error) {
      console.error("Error during room join validation:", error);
      socket.emit("error", "An error occurred while trying to join the room.");
    }
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

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

export default chatHandler;
