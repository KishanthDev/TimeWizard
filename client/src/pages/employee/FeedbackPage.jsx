import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTasks } from "../../slices/taskSlice";

const FeedbackPage = () => {
  const { myTasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter tasks that need revision
  const revisionTasks = myTasks.filter((task) => task.status === "needs_revision");

  return (
    <div className="feedback-page">
      <h2 className="text-xl font-semibold p-5">Tasks Needing Revision</h2>

      {revisionTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-10 lg:px-20">
          {revisionTasks.map((task) => (
            <div key={task._id} className="bg-gray-100 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>

              {/* Show Admin's Feedback */}
              <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                <p>Admin Feedback: {task.latestRevisionComment}</p>
              </div>

              {/* Resubmit Button */}
              <button
                onClick={() => handleResubmit(task._id)}
                className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Resubmit Task
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tasks need revision.</p>
      )}
    </div>
  );
};

export default FeedbackPage;
