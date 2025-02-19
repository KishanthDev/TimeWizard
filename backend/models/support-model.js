import { Schema,model } from "mongoose";

const supportSchema = new Schema({
  type: { 
    type: String, 
    enum: ['contact-form', 'email-query', 'faq', 'general'], // Different types of support
    required: true 
  },
  name: { type: String, required: false },
  email: { type: String, required: false },
  message: { type: String, required: false },  // For contact form and email queries
  question: { type: String, required: false }, // For FAQ queries
  answer: { type: String, required: false },  // For storing answers to FAQs
  submittedAt: { type: Date, default: Date.now }
});

// Create model from schema
const Support = model('Support', supportSchema);

export default Support
