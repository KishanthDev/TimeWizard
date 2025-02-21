import React, { useEffect } from 'react';
import TaskClockInOut from '../../components/employee-task/TaskClockInOut';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTasks } from '../../slices/taskSlice';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
const TaskDetailsPage = () => {
  const { myTasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch,myTasks]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter tasks by status
  const pendingTasks = myTasks.filter((task) => task.status === 'pending');
  const ongoingTasks = myTasks.filter((task) => task.status === 'ongoing');
  const completedTasks = myTasks.filter((task) => task.status === 'completed');

  return (
    <div className="task-details-page ">
      <ToastContainer/>
      <Helmet>
        <title>Tasks • TimeWizard</title>
      </Helmet>
      {/* Pending Tasks */}
      <div className="pending-tasks mb-6">
        <h2 className="text-xl font-semibold p-5 mb-2">Pending Tasks</h2>
        {pendingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-10 lg:px-20">
            {pendingTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center shadow-md">
              No pending tasks found. 📝
            </p>

          </div>
        )}
      </div>

      {/* Ongoing Tasks */}
      <div className="ongoing-tasks mb-6">
        <h2 className="text-xl font-semibold p-5 mb-2">Ongoing Tasks</h2>
        {ongoingTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-10 lg:px-20">
            {ongoingTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center shadow-md">
              No ongoing tasks found. 📝
            </p>

          </div>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="completed-tasks mb-6">
        <h2 className="text-xl font-semibold p-5 mb-2">Completed Tasks</h2>
        {completedTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-10 lg:px-20">
            {completedTasks.map((task) => (
              <TaskClockInOut key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks-found">
            <p className="text-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center shadow-md">
              No completed tasks found. 📝
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
