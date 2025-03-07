import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    estimatedTime:Number,
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed","overdue","pending_review", "needs_revision"],
      default: "pending",
    },
    timeSpent: [
      {
        clockIn: { type: Date },
        clockOut: { type: Date },
      },
    ],
    submissionHistory: [
      {
        submittedAt: { type: Date, default: Date.now },
        notes: String,
        attachments: [{
          publicId: { type: String },
          filePath: {type:String}
        }]
      }
    ],
    rejectionDetails: {
      feedback: {type :String},
      reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
      rejectedAt: Date,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    completedAt: Date
  },
  { timestamps: true }
);

const Task = model("Task", TaskSchema);

export default Task;
