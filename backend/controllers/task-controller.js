import Task from "../models/task-model.js";
import Project from "../models/project-model.js";
import ActivityLog from "../models/activity-model.js";

const taskController = {};

taskController.createTask = async (req, res) => {
  const userId = req.params.userId
  try {
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

    const task = await Task.findById(taskId);
    if(task.status==="pending"){
      task.status="ongoing"
    }
    if(task.status==="completed"){
      return res.status(400).json({error:"Task is already completed"})
    }
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const lastEntry = task.timeSpent[task.timeSpent.length - 1];
    if (lastEntry && !lastEntry.clockOut) {
      return res.status(400).json({ message: "You must clock out before clocking in again." });
    }

    // Add a new clock-in entry
    task.timeSpent.push({ clockIn: new Date() });

    await ActivityLog.create({
      userId:task.assignedTo,
      action: 'clocked in',
      taskId,
      projectId:task.projectId,
      details: `Clocked in for Task ${taskId} in Project ${task.projectId}`,
    });
    
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


    await ActivityLog.create({
      userId:task.assignedTo,
      action: 'clocked out',
      taskId,
      projectId:task.projectId,
      details: `Clocked in for Task ${taskId} in Project ${task.projectId}`,
    });

    await task.save();
    res.status(200).json({ message: "Clock-out recorded", task });
  } catch (error) {
    console.error("Error recording clock-out:", error);
    res.status(500).json({ message: "Error recording clock-out", error: error.message });
  }
};


taskController.get = async (req,res) => {
  try {
    const tasks = await Task.find({assignedTo:req.currentUser.id}).populate("projectId","name")
    if(!tasks){
      return res.status(400).json({error:"No tasks assigned to you"})
    }
    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({message:"Error occured while geting the tasks",error:error.message})
  }
}


taskController.getEmployeeTasksForProject = async (req, res) => {
  try {
    const { projectId, employeeId } = req.params;

    const tasks = await Task.find({ projectId, assignedTo: employeeId })
      .populate("projectId", "name description")  // Populate project details
      .populate("assignedTo", "name email"); // Populate user details

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

taskController.getAll = async (req, res) => {
  try {
    let tasks;
    if (req.currentUser.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignedTo: req.currentUser.id });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while getting tasks",
      error: error.message,
    });
  }
};

export default taskController;
