import cron from "node-cron";
import Project from "../models/project-model.js"

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  const currentDate = new Date();
  
  await Project.updateMany(
    { deadLine: { $lt: currentDate }, status: { $ne: "completed" } },
    { $set: { status: "overdue" } }
  );

  console.log("Checked for overdue tasks.");
});
