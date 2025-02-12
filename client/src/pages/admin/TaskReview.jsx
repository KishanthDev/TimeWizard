import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveTask,requestRevision } from "../../slices/taskSlice";


const TaskReview = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.pendingReviewTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const handleApprove = (taskId) => {
    dispatch(approveTask(taskId));
  };

  const handleRequestRevision = (taskId) => {
    if (!feedback.trim()) return alert("Feedback is required!");
    dispatch(requestRevision({ taskId, feedback }));
    setShowFeedbackInput(false);
    setFeedback("");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Task Review</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks pending review.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 border rounded-lg dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{task.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Status:</strong> <span className="text-blue-500">Pending Review</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>

              {showFeedbackInput && selectedTask === task._id && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter revision feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <button
                    onClick={() => handleRequestRevision(task._id)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Confirm Revision Request
                  </button>
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleApprove(task._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(task._id);
                    setShowFeedbackInput(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Request Revision
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskReview;
