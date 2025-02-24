import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      "date": "2025-02-22",
      "clockIn": "09:00 AM",
      "clockOut": "06:00 PM",
      "totalHours": 9,
      "tasksCompleted": [
        {
          "taskName": "Task A",
          "completedAt": "11:30 AM",
          "duration": 2.5
        },
        {
          "taskName": "Task B",
          "completedAt": "04:45 PM",
          "duration": 3
        }
      ]
    },
    {
      "date": "2025-02-21",
      "clockIn": "10:00 AM",
      "clockOut": "07:00 PM",
      "totalHours": 9,
      "tasksCompleted": [
        {
          "taskName": "Task C",
          "completedAt": "02:00 PM",
          "duration": 4
        }
      ]
    }
  ]
  
const ActivityLogsChart = () => {
    return (
        <div className="p-6 bg-white shadow rounded-lg dark:bg-gray-900 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">📊 Employee Activity Overview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart for Total Work Hours */}
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Work Hours</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWorkHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="totalHours" stroke="#8884d8" fillOpacity={1} fill="url(#colorWorkHours)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Line Chart for Clock-in, Clock-out, and Completed Tasks */}
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Clock-ins, Clock-outs, Completed Tasks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="clockIns" stroke="#4caf50" strokeWidth={2} />
                            <Line type="monotone" dataKey="clockOuts" stroke="#f44336" strokeWidth={2} />
                            <Line type="monotone" dataKey="completedTasks" stroke="#ffc107" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Log Data */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">📅 Detailed Activity Logs</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Date</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Clock-ins</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Clock-outs</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Completed Tasks</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Total Work Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((entry, index) => (
                                <tr key={index} className="text-center border-b border-gray-300 dark:border-gray-700">
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{entry.date}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-green-500">{entry.clockIns}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-red-500">{entry.clockOuts}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-yellow-500">{entry.completedTasks}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 font-bold">{entry.totalHours} hrs</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogsChart;
