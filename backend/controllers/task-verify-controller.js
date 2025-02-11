import Task from "../models/task-model.js";
import cloudinary from "../config/cloudinary.js";
import ActivityLog from "../models/activity-model.js";


const taskVerifyController = {}
taskVerifyController.submitTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { notes } = req.body;
      const files = req.files; // Get uploaded files
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      if (task.status === "completed") {
        return res.status(400).json({ message: "Task is already marked as completed." });
      }
  
      // Ensure there's no active clock-in session
      const activeEntry = task.timeSpent.find(entry => !entry.clockOut);
      if (activeEntry) {
        return res.status(400).json({ message: "Clock out before submitting the task." });
      }
  
      // Handle file uploads
      let uploadedAttachments = [];
      if (files && files.length > 0) {
        const uploadPromises = req.files.map(file => {
          console.log("Uploading file:", file); // Debugging line
          return cloudinary.uploader.upload(file.path, {
            folder: "task_attachments",
            resource_type: "auto",
          });
        });
        
  
        const uploadResults = await Promise.all(uploadPromises); // Wait for all uploads
  
        uploadedAttachments = uploadResults.map(result => ({
          filePath: result.secure_url, // Cloudinary URL
          publicId: result.public_id,  // Cloudinary Public ID
        }));
      }
  
      // Push to submissionHistory instead of overwriting
      task.submissionHistory.push({
        notes,
        attachments: uploadedAttachments,
        submittedAt: new Date(),
      });
  
      await task.save();
  
      // Log Activity
      await ActivityLog.create({
        userId: task.assignedTo,
        action: "submitted a task",
        taskId,
        projectId: task.projectId,
        details: `Task ${taskId} submitted for review in Project ${task.projectId}`,
      });
  
      // Notify Admin
      io.to(task.projectId).emit("taskSubmitted", { taskId, projectId: task.projectId });
  
      res.status(200).json({ message: "Task submitted for review.", task });
  
    } catch (error) {
      console.error("Error submitting the task:", error);
      res.status(500).json({ message: "An error occurred while submitting the task.", error: error.message });
    }
  };
  
  taskVerifyController.approveTask = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // ✅ Check if any submission exists in review
      const hasPendingReview = task.submissionHistory.some(
        (ele) => ele.status === "pending_review" || ele.status === "needs_revision"
      );
  
      if (!hasPendingReview) {
        return res.status(400).json({ message: "Task must be in review before approval." });
      }
  
      // ✅ Mark all "pending_review" or "needs_revision" submissions as "approved"
      task.submissionHistory.forEach((submission) => {
        if (submission.status === "pending_review" || submission.status === "needs_revision") {
          submission.status = "approved";
        }
      });
  
      // ✅ Mark task as completed
      task.status = "completed";
      task.completedAt = new Date();
      await task.save();
  
      // ✅ Log Activity
      await ActivityLog.create({
        userId: task.assignedTo,
        action: 'approved a task',
        taskId,
        projectId: task.projectId,
        details: `Task ${taskId} marked as completed in Project ${task.projectId}`,
      });
  
      // ✅ Notify the employee
      io.to(task.assignedTo).emit("taskApproved", { taskId, projectId: task.projectId });
  
      res.status(200).json({ message: "Task approved and marked as completed.", task });
  
    } catch (error) {
      console.error("Error approving the task:", error);
      res.status(500).json({ message: "An error occurred while approving the task.", error: error.message });
    }
  };
  
  
  taskVerifyController.requestRevision = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { feedback } = req.body; // Admin gives feedback for revision
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Find the latest submission that is pending review
      const lastSubmission = task.submissionHistory.find(
        (submission) => submission.status === "pending_review"
      );
  
      if (!lastSubmission) {
        return res.status(400).json({ message: "No pending review submission found." });
      }
  
      // Mark the submission as "needs_revision"
      lastSubmission.status = "needs_revision";
  
      // Store feedback for the revision
      task.rejectionDetails = {
        feedback,
        reviewedBy: req.user.id, // Assuming the admin is authenticated
        rejectedAt: new Date(),
      };
  
      await task.save();
  
      // Log Activity
      await ActivityLog.create({
        userId: task.assignedTo,
        action: 'requested a revision',
        taskId,
        projectId: task.projectId,
        details: `Task ${taskId} requires revision in Project ${task.projectId}. Feedback: ${feedback}`,
      });
  
      // Notify the employee
      io.to(task.assignedTo).emit("taskNeedsRevision", { taskId, feedback });
  
      res.status(200).json({ message: "Task revision requested.", task });
  
    } catch (error) {
      console.error("Error requesting revision:", error);
      res.status(500).json({ message: "An error occurred while requesting revision.", error: error.message });
    }
  };
  
  export default taskVerifyController