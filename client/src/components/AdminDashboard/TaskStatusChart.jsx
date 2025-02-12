import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice";
import { FaSyncAlt } from "react-icons/fa";

const TaskStatusChart = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTasks({limit:20}));
  }, [dispatch]);

  const allTasks = useSelector((state) => state.tasks?.allTasks || []);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (allTasks.length > 0) {
      const taskStatusCount = allTasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { pending: 0, ongoing: 0, completed: 0 }
      );
        setData([
          { name: "Pending", value: taskStatusCount.pending },
          { name: "Ongoing", value: taskStatusCount.ongoing },
          { name: "Completed", value: taskStatusCount.completed }
        ]);
    }
  }, [allTasks]);

  const handleRefresh = () => {
    dispatch(fetchAllTasks());
  };

  if (data.length === 0) {
    return <>Loading...</>;
  }

  const COLORS = ["#FFA500", "#007BFF", "#28A745"];

  return (
    <div className="flex flex-col items-start bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs mx-4">
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-2xl font-bold mb-4">Tasks - {allTasks.length}</h3>
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
          animationEasing="ease-out" // Smoother effect
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TaskStatusChart;