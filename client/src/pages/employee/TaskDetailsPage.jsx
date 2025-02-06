import React, { useEffect } from 'react';
import TaskClockInOut from '../../components/employee-task/TaskClockInOut';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTasks } from '../../slices/taskSlice';
import "./TaskDetailsPage.css"
const TaskDetailsPage = () => {
  const { myTasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter tasks by status
  const pendingTasks = myTasks.filter((task) => task.status === 'pending');
  const ongoingTasks = myTasks.filter((task) => task.status === 'ongoing');
  const completedTasks = myTasks.filter((task) => task.status === 'completed');

  return (
    <div className="task-details-page">
      {/* Pending Tasks */}
      <div className="pending-tasks mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Tasks</h2>
        {pendingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600">No pending tasks found.</p>
          </div>
        )}
      </div>

      {/* Ongoing Tasks */}
      <div className="ongoing-tasks mb-6">
        <h2 className="text-xl font-semibold mb-2">Ongoing Tasks</h2>
        {ongoingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600">No ongoing tasks found.</p>
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="completed-tasks mb-6">
        <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
        {completedTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600">No completed tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
