import cron from "node-cron";
import Task from "../models/task-model.js"

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  const currentDate = new Date();
  
  await Task.updateMany(
    { dueDate: { $lt: currentDate }, status: { $ne: "completed" } },
    { $set: { status: "overdue" } }
  );

  console.log("Checked for overdue tasks.");
});
