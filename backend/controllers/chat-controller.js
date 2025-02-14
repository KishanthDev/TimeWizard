import Chat from "../models/chat-model.js";
import GeneralChat from "../models/generalChat-model.js";
import { validationResult } from "express-validator";
const chatController = {}

chatController.get = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const  id  = req.params.id;
    try {
      const messages = await Chat.find({ projectId: id })
        .populate("projectId", "name") // Ensure `projectId` exists in schema
        .populate("userId", "username") // Ensure `userId` exists in schema
        .sort({ createdAt: 1 });
  
      if (!messages || messages.length === 0) {
        return res.json({ message: "No messages found for this project." });
      }
  
      const transformedMessages = messages.map((message) => ({
        text: message.text,
        timestamp: message.createdAt || message.timestamp, // Ensure timestamp exists
        user: message.userId?.username || "Unknown", // Handle missing data
        project: message.projectId?.name || "Unknown Project", // Handle missing data
        userId:message.userId?._id
      }));
  
      res.json(transformedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err); // Log full error
      res.status(500).json({ error: "Error fetching messages", details: err.message });
    }
  };


chatController.getGeneralMessages = async (req, res) => {
  try {
    const messages = await GeneralChat.find().sort({ createdAt: 1 }); // Get messages in ascending order
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching general messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export default chatController