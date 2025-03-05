import { Schema,model } from "mongoose";

const supportSchema = new Schema({
  employeeId:Schema.Types.ObjectId,
  name: { type: String, required: false },
  email: { type: String, required: false },
  message: { type: String, required: false },  // For contact form and email queries
  question: { type: String, required: false }, // For FAQ queries
  responseMessage : { type: String, required: false },  // For storing answers to FAQs
  submittedAt: { type: Date, default: Date.now },
  responseTime:Date
});

// Create model from schema
const Support = model('Support', supportSchema);

export default Support
