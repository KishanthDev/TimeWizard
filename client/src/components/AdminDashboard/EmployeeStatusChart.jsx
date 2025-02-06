import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice";
import { FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import for navigation

const EmployeeStatusChart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  
  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  const allTasks = useSelector((state) => state.tasks?.allTasks || []);
  
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (allTasks.length > 0) {
      const employeeStatus = allTasks.reduce((acc, task) => {
        const isActive = task.timeSpent.some((entry) => entry.clockIn && !entry.clockOut);
        
        if (isActive) {
          acc.active += 1;
        } else {
          acc.inactive += 1;
        }
        
        return acc;
      }, { active: 0, inactive: 0 });
      
      setData([
        { name: "Active", value: employeeStatus.active },
        { name: "Inactive", value: employeeStatus.inactive }
      ]);
    }
  }, [allTasks]);

  const handleRefresh = () => {
    dispatch(fetchAllTasks());
  };

  if (data.length === 0) {
    return <>Loading...</>;
  }

  const COLORS = ["#00C49F", "#FF4444"];

  // Function to navigate to employee details
  const handleViewDetails = () => {
    navigate("/emp"); // Navigate to employee details page
  };

  return (
    <div className="flex flex-col items-start bg-gray-100 p-4 rounded-xl shadow-lg max-w-xs mx-4">
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-lg font-semibold">Employee Status</h3>
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
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <p 
        onClick={handleViewDetails}
        className="text-blue-500 hover:underline cursor-pointer mt-3"
      >
        View Employee Details
      </p>
    </div>
  );
};

export default EmployeeStatusChart;
