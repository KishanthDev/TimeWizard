import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { format, isPast } from "date-fns";

const EmployeeDashboardTask = ({ projectId, isOpen }) => {
  const navigate = useNavigate();
  const { allTasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.user);
  const [showOverdue, setShowOverdue] = useState(false);

  // Filter tasks
  const assignedTasks = allTasks.filter(
    (task) => task.assignedTo === user._id && ["pending", "overdue","ongoing"].includes(task.status)
  );

  const overdueTasks = assignedTasks.filter((task) => isPast(new Date(task.dueDate)));
  const activeTasks = assignedTasks.filter((task) => !isPast(new Date(task.dueDate)));

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Tasks Assigned to You</h2>

      {/* Active Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTasks.length > 0 ? (
          activeTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.name}</h3>
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate("/employee-task")}
                >
                  <Eye size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deadline: {format(new Date(task.dueDate), "dd MMM yyyy")}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className={`px-3 py-1 rounded text-white ${task.status === "pending" ? "bg-yellow-500" : "bg-blue-500"}`}>
                  {task.status}
                </span>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => {
                    isOpen();
                    projectId(task.projectId);
                  }}
                >
                  Chat
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 bg-gray-100 p-3 rounded-md text-center shadow-md">
            No pending tasks! 🎉 Enjoy your break! ☕
          </p>
        )}
      </div>

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div className="mt-6">
          <button
            className="flex items-center justify-between w-full bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={() => setShowOverdue(!showOverdue)}
          >
            <span>Overdue Tasks ({overdueTasks.length})</span>
            {showOverdue ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showOverdue && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.map((task) => (
                <div key={task.id} className="bg-gray-100 dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-500">{task.name}</h3>
                  <p className="text-sm text-gray-500">
                    Deadline: {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </p>
                  <p className="text-red-500 font-bold text-sm mt-2">
                    Task is overdue. Contact Admin.
                  </p>
                  {/* Request Extension Button */}
                  <button
                    className="mt-3 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                    onClick={() =>
                      navigate(`/support`, {
                        state: { taskId: task._id, taskName: task.name, dueDate: task.dueDate },
                      })
                    }
                  >
                    Request Extension
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboardTask;
