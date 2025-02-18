import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clockIn, clockOut, completeTask } from "../../slices/taskSlice";
import { View } from "lucide-react";
import ProjectDetailsModal from "./ProjectDetailsModal";
import SubmissionHistoryModal from "./SubmissionHistoryModal";
import TaskCompletionModal from "./TaskSubmission";
import { format, differenceInDays, differenceInHours } from "date-fns";
import AutoClockOut from "./AutoClockOut";

const TaskClockInOut = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSubmissionHistory, setShowSubmissionHistory] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { clockedInTasks } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const isClockedIn = clockedInTasks[task._id] || false;
  
  const daysLeft = differenceInDays(new Date(task.dueDate), new Date());
  const hoursLeft = differenceInHours(new Date(task.dueDate), new Date());
  const isDueSoon = daysLeft >= 0 && daysLeft <= 3;

  const handleProjectModal = () => setIsOpen((prev) => !prev);
  const handleSubmissionHistoryModal = () => setShowSubmissionHistory((prev) => !prev);
  const handleCompletionModal = () => setShowCompletionModal((prev) => !prev);

  const handleClockIn = () => {
    dispatch(clockIn({ taskId: task._id }));
  };
  const [expanded, setExpanded] = useState(false);

  const handleClockOut = () => {
    dispatch(clockOut({ taskId: task._id }));
  };

  const handleCompleteTask = async (submissionData) => {
    try {
      dispatch(completeTask({ taskId: task._id, submissionData })).unwrap()
    } catch (err) {
      console.log(err);
    }
    setShowCompletionModal(false);
  };

  const calculateTotalTime = () => {
    if (!task.timeSpent || task.timeSpent.length === 0) return 0;
    return task.timeSpent
      .reduce((total, entry) => {
        const timeWorked = (new Date(entry.clockOut) - new Date(entry.clockIn)) / 1000 / 60 / 60;
        return total + timeWorked;
      }, 0)
      .toFixed(2);
  };
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className={`task-clockin-out bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 my-4 max-w-xl mx-auto ${(task.status!=="completed" && isDueSoon) ? "border border-red-500" : "border border-green-500"}`}>
      <div className="task-details mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold dark:text-gray-200 text-gray-700">
            Project: <span className="text-blue-600">{task.projectId.name}</span>
          </h1>
          <button onClick={handleProjectModal} className="text-blue-500 hover:text-blue-700">
            <View size={20} />
          </button>
        </div>
        <h2 className="text-base font-semibold dark:text-gray-200 text-gray-700">
          Task: <span className="text-green-600">{task.name}</span>
        </h2>
        <div className="flex justify-between">
        <p className="text-sm dark:text-gray-400 text-gray-500">Deadline: {format(new Date(task.dueDate), 'dd MMM yyyy')}</p>
        {task.status !== 'completed' && (
          <div className="flex justify-between">
            <p className="text-sm dark:text-gray-400 text-gray-500">Deadline: {format(new Date(task.dueDate), 'dd MMM yyyy')}</p>
            {isDueSoon && (
              <p className="text-red-500 font-bold text-sm">
                {daysLeft > 0 ? `${daysLeft} days to go` : `${hoursLeft} hours to go`}
              </p>
            )}
          </div>
        )}
        </div>
        <p className="text-sm dark:text-gray-400 text-gray-500">Estimated Time: {task.estimatedTime} hours</p>
        <p className="text-sm dark:text-gray-400 text-gray-500">Total Hours Worked: {calculateTotalTime()} hours</p>
      </div>
      
      {task.status !== 'completed' ? (
        <div className="flex justify-between gap-28 items-center mb-4">
          {isClockedIn && <AutoClockOut taskId={task._id} />}
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            className={`px-3 py-1 rounded-lg text-white ${isClockedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>

          <button
            onClick={handleCompletionModal}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
          >
            {task.status === 'pending_review' ? 'Waiting for Review' : task.status === 'needs_revision' ? 'Resubmit Task' : 'Complete Task'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button onClick={handleSubmissionHistoryModal} className="text-blue-500 hover:text-blue-700">
            View Submission History
          </button>
        </div>
      )}
       <div className="time-summary">
        <div className="flex justify-between gap-40 items-center">
          <p className="text-sm font-semibold">Time Entries</p>
          <button
            onClick={toggleExpand}
            className="text-blue-500 hover:text-blue-700"
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Absolutely positioned log details to prevent card height expansion */}
        <div
          className={`transition-all duration-300 overflow-hidden ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg p-4 mt-2 shadow-md">
            {task.timeSpent && task.timeSpent.length > 0 ? (
              task.timeSpent.map((entry, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <p className="text-sm">
                    {new Date(entry.clockIn).toLocaleTimeString()} -{" "}
                    {new Date(entry.clockOut).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs dark:bg-gray-700 dark:text-gray-200  text-gray-500">No time entries yet.</p>
            )}
          </div>
        </div>
      </div>

      {isOpen && <ProjectDetailsModal isOpen={isOpen} handleProjectModal={handleProjectModal} projectId={task.projectId._id} />}
      {showSubmissionHistory && <SubmissionHistoryModal isOpen={showSubmissionHistory} handleClose={handleSubmissionHistoryModal} submissions={task.submissionHistory} />}
      {showCompletionModal && <TaskCompletionModal isOpen={showCompletionModal} handleClose={handleCompletionModal} handleSubmit={handleCompleteTask} />}
    </div>
  );
};

export default TaskClockInOut;
