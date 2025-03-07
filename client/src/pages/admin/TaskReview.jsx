import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveTask, fetchAllTasks, requestRevision, setPendingReviewTasks } from "../../slices/taskSlice";
import { Helmet } from "react-helmet";
import ViewOverdueTasks from "./ViewOverdueTasks";

const TaskReview = () => {
  const dispatch = useDispatch();
  const { pendingReviewTasks, allTasks } = useSelector((state) => state.tasks);
  const { employees } = useSelector((state) => state.employees);
  const { projects } = useSelector(state => state.projects) 
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setPendingReviewTasks());
  }, [allTasks, dispatch]);

  const handleApprove = (taskId) => {
    dispatch(approveTask(taskId));
  };

  const handleRequestRevision = (taskId) => {
    if (!feedback.trim()) return alert("Feedback is required!");
    dispatch(requestRevision({ taskId, feedback }));
    setShowFeedbackInput(false);
    setFeedback("");
  };

  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp._id === id);
    return employee ? employee.username : "Unknown";
  };

  const getProjectName = (id) => {
    const project = projects.find(proj => proj._id === id);
    return project ? project.name : "Unknown";
  };

  return (
    <>
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg mt-10 rounded-lg">
      <Helmet>
        <title>Task Review • TimeWizard</title>
      </Helmet>
      
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Task Review</h2>

      {pendingReviewTasks.length === 0 ? (
        <p className="text-gray-500">No tasks pending review.</p>
      ) : (
        <div className="space-y-4">
          {pendingReviewTasks.map((task) => (
            <div key={task._id} className="p-4 border rounded-lg dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Task - {task.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Assigned To:</strong> {getEmployeeName(task.assignedTo)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Project:</strong> {getProjectName(task.projectId)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Status:</strong> <span className="text-blue-500">Pending Review</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

              {/* Attachments */}
              {task.submissionHistory.length > 0 && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Submission History</h4>
                  {task.submissionHistory.map((submission) => (
                    <div key={submission._id} className="mt-2 p-2 border rounded-lg dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Notes:</strong> {submission.notes}
                      </p>
                      {submission.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments:</p>
                          <div className="flex gap-2 flex-wrap">
                            {submission.attachments.map((file) => (
                              <a
                                key={file._id}
                                href={file.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                View Attachment
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}


              {/* Feedback Input */}
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

              {/* Action Buttons */}
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
    <ViewOverdueTasks/>
    </>
  );
};

export default TaskReview;
