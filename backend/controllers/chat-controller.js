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
        const messages = await Chat.find({projectId:id}).sort({ timestamp: 1 });//asc
        res.json(messages);
      } catch (err) {
        res.status(500).json({ error: "Error fetching messages" });
      }
}

export default chatController