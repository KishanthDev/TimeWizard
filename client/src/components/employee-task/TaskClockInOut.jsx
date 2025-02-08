import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clockIn, clockOut, completeTask } from '../../slices/taskSlice';
import { View } from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';
import { format } from 'date-fns';

const TaskClockInOut = ({ task }) => {
  const [isOpen,setIsOpen] = useState(false)
  // Get the last time entry to determine the clock-in status
  const lastEntry = task.timeSpent?.[task.timeSpent.length - 1];
  const [isClockedIn, setIsClockedIn] = useState(
    lastEntry && !lastEntry.clockOut ? true : false
  );
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleProjectModal = ()=>{setIsOpen(prev=>!prev)}

  // Function to start the clock-in (save the clock-in time)
  const handleClockIn = () => {
    setIsClockedIn(true);
    dispatch(clockIn({ taskId: task._id }));
  };

  // Function to stop the clock-out (save the clock-out time and calculate the duration)
  const handleClockOut = () => {
    setIsClockedIn(false);
    dispatch(clockOut({ taskId: task._id }));
  };

  // Function to mark task as complete
  const handleCompleteTask = () => {
    dispatch(completeTask({ taskId: task._id }));
  };

  // Calculate total time worked based on clock-in and clock-out times in task object
  const calculateTotalTime = () => {
    if (!task.timeSpent || task.timeSpent.length === 0) return 0;

    return task.timeSpent.reduce((total, entry) => {
      const timeWorked = (new Date(entry.clockOut) - new Date(entry.clockIn)) / 1000 / 60 / 60; // Convert milliseconds to hours
      return total + timeWorked;
    }, 0).toFixed(2);
  };

  // Toggle expand/collapse time entries section
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="task-clockin-out bg-white shadow-md rounded-lg p-6 my-4 max-w-xl mx-auto">
      {/* Task Details */}
      <div className="task-details mb-4">
      <div className="mb-4">
      <div className="flex items-center gap-2">
  <h1 className="text-lg font-semibold text-gray-700">
    Project: <span className="text-blue-600">{task.projectId.name}</span>
  </h1>
  <button onClick={handleProjectModal} className="text-blue-500 hover:text-blue-700">
    <View size={20} />
  </button>
</div>
  <h2 className="text-base font-semibold text-gray-700">
    Task: <span className="text-green-600">{task.name}</span>
  </h2>
</div>
        <p className="text-sm text-gray-500">Due Date: {format(new Date(task.dueDate), "dd MMM yyyy")}</p>
        <p className="text-sm text-gray-500">Estimated Time: {task.estimatedTime} hours</p>
        <p className="text-sm text-gray-500">Total Hours Worked: {calculateTotalTime()} hours</p>
      </div>

      {/* Clock In / Clock Out and Complete Task Button */}
      {task.status!=="completed" && (
        <div className="flex justify-between gap-40 items-center mb-4">
          <div>
            {!isClockedIn ? (
              <button
                onClick={handleClockIn}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                Clock In
              </button>
            ) : (
              <button
                onClick={handleClockOut}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Clock Out
              </button>
            )}
          </div>

          <div>
            {task.status!=="completed" && (
              <button
                onClick={handleCompleteTask}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Complete Task
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expandable Time Entries */}
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
          className={`transition-all duration-300 overflow-hidden ${
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-100 rounded-lg p-4 mt-2 shadow-md">
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
              <p className="text-xs text-gray-500">No time entries yet.</p>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <ProjectDetailsModal
          isOpen={isOpen}
          handleProjectModal={handleProjectModal}
          projectId={task.projectId._id}
        />
      )}
    </div>
  )
};


export default TaskClockInOut;
