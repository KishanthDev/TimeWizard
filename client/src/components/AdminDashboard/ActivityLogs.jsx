import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../slices/activitySlice";
import { format } from "date-fns";

const ActivityBarChart = () => {
    const dispatch = useDispatch();
    const { activities } = useSelector((state) => state.activities);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        dispatch(fetchActivities({limit:20}));
    }, [dispatch]);

    useEffect(() => {
        if (activities.length > 0) {
            const dataMap = {};
            activities.forEach((activity) => {
                const date = format(new Date(activity.timestamp), "dd MMM yyyy"); // Group by date
                if (!dataMap[date]) {
                    dataMap[date] = { date, "Clock In": 0, "Clock Out": 0, "Completed Task": 0 };
                }
                if (activity.action === "clocked in") dataMap[date]["Clock In"] += 1;
                if (activity.action === "clocked out") dataMap[date]["Clock Out"] += 1;
                if (activity.action === "completed a task") dataMap[date]["Completed Task"] += 1;
            });

            setChartData(Object.values(dataMap));
        }
    }, [activities]);

    return (
        <div className="bg-white  dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Employee Activity Overview</h2>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="60%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Clock In" fill="#82ca9d" />
                        <Bar dataKey="Clock Out" fill="#ff7300" />
                        <Bar dataKey="Completed Task" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500">No recent activity</p>
            )}
        </div>
    );
};

export default ActivityBarChart;
