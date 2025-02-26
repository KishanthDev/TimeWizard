import { Schema, model } from 'mongoose';

const ChatSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Chat = model('Chat', ChatSchema);
export default Chat;
