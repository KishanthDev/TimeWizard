import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUserEdit, FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { fetchAllTasks, updateTaskDetails } from "../../slices/taskSlice";
import { toast, ToastContainer } from "react-toastify";

const OverdueTasks = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks.allTasks);
  const employees = useSelector((state) => state.employees.employees);
  const [newDueDate, setNewDueDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [updatedTask, setUpdatedTask] = useState(null);

  const overdueTasks = allTasks.filter((task) => task.status === "overdue");

  useEffect(() => {
    dispatch(fetchAllTasks()); // Fetch tasks whenever component mounts
  }, [dispatch, updatedTask]); // Re-fetch whenever updatedTask changes

  const handleUpdateTask = async (taskId) => {
    const updatedData = {};
    if (newDueDate) updatedData.dueDate = newDueDate;
    if (selectedEmployee[taskId]) updatedData.assignedTo = selectedEmployee[taskId];

    if (Object.keys(updatedData).length > 0) {
      try {
        await dispatch(updateTaskDetails({ taskId, updatedData })).unwrap();
        setUpdatedTask(taskId);
        toast.success("Task Updated");
      } catch (error) {
        toast.error(error.message || "Error updating task");
      }
      setNewDueDate("");
      setSelectedEmployee({ ...selectedEmployee, [taskId]: "" });
    }
  };

  return (
    <div className="p-4 mt-4 bg-gray-800 text-white min-h-screen rounded-lg">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Overdue Tasks - {overdueTasks.length}</h2>
      <div className="grid gap-4">
        {overdueTasks.map((task) => (
          <div key={task._id} className="p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-red-400">Due Date: {format(new Date(task.dueDate), "PPPP")}</p>
            <p className="text-gray-300">Assigned To: {task.assignedTo.name}</p>

            <div className="mt-2 flex items-center gap-2">
              <FaRegCalendarAlt />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="border p-1 rounded-md bg-gray-700 text-white"
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <FaUserEdit />
              <select
                value={selectedEmployee[task._id] || task.assignedTo._id}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [task._id]: e.target.value })}
                className="border p-1 rounded-md bg-gray-700 text-white"
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <button
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                onClick={() => handleUpdateTask(task._id)} // Same combined button
              >
                Confirm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverdueTasks;
