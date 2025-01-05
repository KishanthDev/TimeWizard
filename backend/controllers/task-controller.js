import Task from "../models/task-model.js";
import Project from "../models/project-model.js";

const taskController = {};

taskController.createTask = async (req, res) => {
  const userId = req.params.userId
  try {
    if(req.currentUser.role!=="admin"){
      return res.status(403).json({error:"Only admin can assign tasks"})
    }
    
    const { projectId, name, description, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found. Task creation failed." });
    }

    const isEmployeeAssigned = project.teams.includes(userId);
    if (!isEmployeeAssigned) {
      return res.status(400).json({
        message:
          "Employee is not assigned to the project. Task creation not allowed.",
      });
    }

    const task = new Task({
      projectId,
      assignedTo:userId,
      name,
      description,
      dueDate,
    });

    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};


taskController.clockIn = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const lastEntry = task.timeSpent[task.timeSpent.length - 1];
    if (lastEntry && !lastEntry.clockOut) {
      return res.status(400).json({ message: "You must clock out before clocking in again." });
    }

    // Add a new clock-in entry
    task.timeSpent.push({ clockIn: new Date() });
    if(task.status==="pending"){
      task.status="ongoing"
    }
    await task.save();
    res.status(200).json({ message: "Clock-in recorded", task });
  } catch (error) {
    console.error("Error recording clock-in:", error);
    res.status(500).json({ message: "Error recording clock-in", error: error.message });
  }
};

taskController.clockOut = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const lastEntry = task.timeSpent.find(entry => !entry.clockOut);
    if (!lastEntry) {
      return res.status(400).json({ message: "No active clock-in session found" });
    }

    lastEntry.clockOut = new Date();

    await task.save();
    res.status(200).json({ message: "Clock-out recorded", task });
  } catch (error) {
    console.error("Error recording clock-out:", error);
    res.status(500).json({ message: "Error recording clock-out", error: error.message });
  }
};

taskController.getTotalTimeSpent = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const totalTime = task.timeSpent.reduce((total, entry) => {
      if (entry.clockIn && entry.clockOut) {
        const duration = new Date(entry.clockOut) - new Date(entry.clockIn);
        return total + duration;
      }
      return total;
    }, 0);

    const hours = Math.floor(totalTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

    res.status(200).json({
      message: "Total time spent calculated",
      totalTime: `${hours}h ${minutes}m ${seconds}s`,
    });
  } catch (error) {
    console.error("Error calculating total time spent:", error);
    res.status(500).json({ message: "Error calculating total time spent", error: error.message });
  }
};


export default taskController;
