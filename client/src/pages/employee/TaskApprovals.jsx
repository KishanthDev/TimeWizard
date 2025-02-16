import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import TaskSubmission from "../../components/employee-task/TaskSubmission";
import { resubmitTask } from "../../slices/taskSlice";

const TaskApprovals = () => {
  const tasks = useSelector((state) => state.tasks.myTasks);
  const dispatch = useDispatch()
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  // Filter tasks based on status
  const pendingReviewTasks = tasks.filter(
    (task) => task.status === "pending_review" || task.status === "needs_revision"
  );

  const handleOpenSubmission = (task) => {
    setSelectedTask(task);
    setIsSubmissionOpen(true);
  };

  const handleCloseSubmission = () => {
    setIsSubmissionOpen(false);
    setSelectedTask(null);
  };

  const handleResubmitTask = async (taskId) => {
    await dispatch(resubmitTask(taskId));
  };
  
  return (
    <div className="p-6 mt-10 bg-gray-300 dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Task Approvals</h2>
      
      {pendingReviewTasks.length === 0 ? (
        <p className="text-gray-500">No tasks pending review or needing revision.</p>
      ) : (
        <div className="space-y-4">
          {pendingReviewTasks.map((task) => (
            <div key={task._id} className="p-4 border rounded-lg dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{task.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Status:</strong> 
                {task.status === "pending_review" ? (
                  <span className="text-blue-500"> Pending Review</span>
                ) : (
                  <span className="text-red-500"> Needs Revision</span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Due Date:</strong> {format(new Date(task.dueDate), "dd MMM yyyy")}
              </p>

              {task.status === "needs_revision" && task.rejectionDetails && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-md">
                  <strong>Revision Notes:</strong> {task.rejectionDetails.feedback || "No feedback provided"}
                </div>
              )}

{task.status === "needs_revision" ? (
                <button
                  onClick={() => handleResubmitTask(task._id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Resubmit Task
                </button>
              ) : (
                <button
                  onClick={() => handleOpenSubmission(task)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Submission
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isSubmissionOpen && selectedTask && (
        <TaskSubmission
          isOpen={isSubmissionOpen}
          handleClose={handleCloseSubmission}
          submissions={selectedTask.submissionHistory}
          handleSubmit={(data) => console.log("Submitting task:", data)}
        />
      )}
    </div>
  );
};

export default TaskApprovals;
