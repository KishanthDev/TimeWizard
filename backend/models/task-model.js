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
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },
    timeSpent: [
      {
        clockIn: { type: Date },
        clockOut: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const Task = model("Task", TaskSchema);

export default Task;
