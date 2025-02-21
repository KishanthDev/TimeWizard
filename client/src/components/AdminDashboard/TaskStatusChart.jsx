import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const TaskStatusChart = () => {
  const dispatch = useDispatch();
  const { allTasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchAllTasks({ limit: 20 }));
  }, [dispatch]);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (allTasks?.length > 0) {
      const taskStatusCount = allTasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { pending: 0, ongoing: 0, completed: 0 }
      );

      setData([
        { name: "Pending", value: taskStatusCount.pending, color: "#FFA500" },
        { name: "Ongoing", value: taskStatusCount.ongoing, color: "#007BFF" },
        { name: "Completed", value: taskStatusCount.completed, color: "#28A745" }
      ]);
    }
  }, [allTasks]);

  const handleRefresh = () => {
    dispatch(fetchAllTasks());
  };

  if (isLoading || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-gray-600 dark:text-gray-300" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-sm">
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Tasks - {allTasks.length}
        </h3>
        <button
          className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 focus:outline-none"
          onClick={handleRefresh}
        >
          <FaSyncAlt size={18} />
        </button>
      </div>

          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label
              isAnimationActive={true} // Ensure animation is active
              animationBegin={0} // Start animation immediately
              animationDuration={1000} // Set duration
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
    </div>
  );
};

export default TaskStatusChart;
