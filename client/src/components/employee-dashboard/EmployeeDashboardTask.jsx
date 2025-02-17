import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageCircle,Eye } from "lucide-react";
import { format } from "date-fns";

const EmployeeDashboardTask = ({projectId,isOpen}) => {
  const navigate = useNavigate();
  const { allTasks } = useSelector((state) => state.tasks);
  const {user} = useSelector((state) => state.user);

  // Filter tasks assigned to the employee and are in "Pending" or "Ongoing" state
  const assignedTasks = allTasks.filter(
    (task) => task.assignedTo === user._id && ["pending", "ongoing"].includes(task.status)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks Assigned to you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignedTasks.length > 0 ? (
          assignedTasks.map((task) => (
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
              <p className="text-sm dark:text-gray-400 text-gray-600">Deadline: {format(new Date(task.dueDate), "dd MMM yyyy")}</p>
              <div className="flex justify-between items-center mt-4">
                <span className={`px-3 py-1 rounded text-white ${
                  task.status === "pending" ? "bg-yellow-500" : "bg-blue-500"
                }`}>
                  {task.status}
                </span>
                <button
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                  onClick={() =>{isOpen()
                    projectId(task.projectId)}
                  }
                >
                  <MessageCircle size={16} /> Chat
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center shadow-md">
  No pending tasks? Lucky you! 🎉 Time to grab a coffee ☕ and enjoy the peace! 😎
</p>


        )}
      </div>
    </div>
  );
};

export default EmployeeDashboardTask;
