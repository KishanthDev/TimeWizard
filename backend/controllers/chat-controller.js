import Chat from "../models/chat-model.js";
import { validationResult } from "express-validator";
const chatController = {}

chatController.get = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const  id  = req.params.id;
    try {
        const messages = await Chat.find({projectId:id})
        .populate({
            path: "projectId", 
            select: "name", 
          })
          .populate({
            path: "userId",
            select: "name",
          })
          .sort({ timestamp: 1 });
    
        const transformedMessages = messages.map((message) => ({
          text: message.text,
          timestamp: message.timestamp,
          user: message.userId.name,
          project: message.projectId.name,
        }));
    
        res.json(transformedMessages);
      } catch (err) {
        res.status(500).json({ error: "Error fetching messages" });
      }
}

export default chatController