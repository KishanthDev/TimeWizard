import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { assignTask,fetchTasks } from "../../slices/taskSlice";
import { toast } from "react-toastify";

const EmployeeTasks = ({ tasks, employee, projectId, onClose }) => {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    estimatedTime: "",
  });

  const handleAssignTask = async () => {
    if (!newTask.name || !newTask.dueDate) {
      toast.error("Task name and due date are required.");
      return;
    }

    const taskData = {
      projectId,
      assignedTo: employee._id,
      ...newTask,
    };

    try {
      await dispatch(assignTask(taskData)).unwrap();
      toast.success("Task assigned successfully");
      setNewTask({ name: "", description: "", dueDate: "", estimatedTime: "" });
      dispatch(fetchTasks({ projectId, employee: employee._id }));
    } catch (error) {
      toast.error("Failed to assign task");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
        <h3 className="text-lg font-semibold mb-4">Tasks for {employee.name}</h3>

        {tasks.length > 0 ? (
          <ul className="list-disc pl-4 space-y-2">
            {tasks.map((task) => (
              <li key={task._id} className="text-sm border-b pb-2">
                <strong>{task.name}</strong> - Due: {new Date(task.dueDate).toLocaleDateString()}
                <div className="text-xs text-gray-500">{task.description || "No description"}</div>
                <div className="text-xs text-gray-500">Estimated Time: {task.estimatedTime} hours</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <p className="text-gray-500">No tasks assigned. Assign a task below:</p>
            <input 
              type="text" 
              placeholder="Task Name" 
              className="w-full p-2 border mt-2 rounded" 
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="Description" 
              className="w-full p-2 border mt-2 rounded" 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input 
              type="date" 
              className="w-full p-2 border mt-2 rounded" 
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Estimated Time (hrs)" 
              className="w-full p-2 border mt-2 rounded" 
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
            />
            <button className="w-full bg-blue-500 text-white py-2 mt-3 rounded hover:bg-blue-600" onClick={handleAssignTask}>
              Assign Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;
