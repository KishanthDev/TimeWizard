import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../slices/activitySlice";
import { useNavigate } from "react-router-dom";

const ACTIONS = [
    { label: "Clock In", value: "clocked in" },
    { label: "Clock Out", value: "clocked out" },
    { label: "Completed Task", value: "completed a task" }
];

const ActivityLog = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { activities, page, totalPages, status, error } = useSelector((state) => state.activities);
    const {user} = useSelector(state=>state.user)
    const [userId, setUserId] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const limit = 5;


    useEffect(() => {
        if (user?.subscription?.plan === "free") {
            navigate("/admin"); // Redirect to another page
        }
    }, [user, navigate]);

    useEffect(() => {
        dispatch(fetchActivities({ page: 1, limit, userId, search: selectedAction, sortOrder }));
    }, [dispatch, userId, selectedAction, sortOrder]);


    return (
        <div className="p-7 bg-white dark:bg-gray-900 dark:text-gray-300 shadow rounded">
            <h2 className="text-xl font-bold mb-9">Activity Logs</h2>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border dark:bg-gray-700 dark:text-gray-300 p-2 rounded"
                >
                    <option value="">All Employees</option>
                    {[...new Map(activities.map((activity) => [activity.userId, activity])).values()].map((uniqueActivity) => (
                        <option key={uniqueActivity.userId} value={uniqueActivity.userId}>
                            {uniqueActivity.user}
                        </option>
                    ))}
                </select>


                {/* Action Filter (Fixing action value mapping) */}
                <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="border dark:bg-gray-700 dark:text-gray-300 p-2 rounded"
                >
                    <option value="">All Actions</option>
                    {ACTIONS.map(({ label, value }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                {/* Sort Order */}
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="p-2 dark:bg-gray-700 dark:text-gray-300 border rounded"
                >
                    Sort: {sortOrder === "asc" ? "Oldest" : "Latest"}
                </button>
            </div>

            {/* Loading & Error Handling */}
            {status === "loading" && <p>Loading activities...</p>}
            {status === "failed" && <p className="text-red-500">{error}</p>}

            {/* Activity Table */}
            {status === "succeeded" && activities.length > 0 ? (
                <>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                                <th className="p-2">Employee</th>
                                <th className="p-2">Project</th>
                                <th className="p-2">Task</th>
                                <th className="p-2">Action</th>
                                <th className="p-2">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (
                                <tr key={activity._id} className="border-t">
                                    <td className="p-2">{activity.user}</td>
                                    <td className="p-2">{activity.project}</td>
                                    <td className="p-2">{activity.task}</td>
                                    <td className="p-2">{activity.action}</td>
                                    <td className="p-2">{new Date(activity.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-between">
                        <button
                            disabled={page === 1}
                            onClick={() => dispatch(fetchActivities({ page: page - 1, limit, userId, action: selectedAction, sortOrder }))}
                            className="p-2 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => dispatch(fetchActivities({ page: page + 1, limit, userId, action: selectedAction, sortOrder }))}
                            className="p-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No activities found</p>
            )}
        </div>
    );
};

export default ActivityLog;
