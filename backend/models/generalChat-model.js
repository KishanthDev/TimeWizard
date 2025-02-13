import {Schema,model} from "mongoose";

const generalChatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const GeneralChat = model("GeneralChat", generalChatSchema);
export default GeneralChat;
