import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignTask, fetchAllTasks } from "../../slices/taskSlice";
import { toast, ToastContainer } from "react-toastify";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.projects);
    const { allTasks } = useSelector((state) => state.tasks);

    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
        dueDate: "",
        estimatedTime: "",
    });

    const myProject = projects?.find((ele) => ele._id === projectId);
    if (!myProject) return <p>Loading project details...</p>;

    const employeeTasks = allTasks?.filter((task) => task.projectId === projectId) || [];

    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const toggleExpand = (employeeId) => {
        setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
    };

    const handleTaskCreation = async (e, employeeId) => {
        e.preventDefault();
        const taskData = { ...newTask, projectId, assignedTo: employeeId };

        try {
            await dispatch(assignTask(taskData)).unwrap();
            await dispatch(fetchAllTasks())
            toast.success("Task assigned successfully");
            setNewTask({ name: "", description: "", dueDate: "", estimatedTime: "" });
        } catch (error) {
            toast.error("Failed to assign task");
        }
    };

    return (
        <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
            <ToastContainer />
            {/* Project Overview */}
            <div className="p-4 shadow-md rounded-lg dark:bg-gray-800">
                <h2 className="text-2xl font-bold border-b pb-2 mb-4 dark:border-gray-700">
                    📌 Project: <span className="text-blue-500">{myProject.name}</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">📝 <strong>Description:</strong> {myProject.description}</p>
                <div className="flex flex-wrap gap-4">
                    <p className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                        🔄 <strong>Status:</strong> {myProject.status}
                    </p>
                    <p className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                        💰 <strong>Budget:</strong> ${myProject.budget}
                    </p>
                </div>
            </div>

            {/* Attachments */}
            <h3 className="mt-6 text-lg font-semibold border-b pb-2 dark:border-gray-700">📎 Attachments</h3>
            <div className="mt-3 flex flex-wrap gap-3">
                {myProject.attachments?.length > 0 ? (
                    myProject.attachments.map((file) => (
                        <a key={file._id} href={file.filePath} target="_blank" rel="noopener noreferrer"
                            className="group relative block w-24 h-24 rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition dark:border-gray-700">
                            <img src={file.filePath} alt="Attachment" className="w-full h-full object-cover group-hover:opacity-75" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium">
                                View
                            </div>
                        </a>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 italic">No attachments available.</p>
                )}
            </div>

            {/* Team Members & Tasks */}
            <h3 className="mt-6 text-lg font-semibold border-b pb-2 dark:border-gray-700">👥 Team Members</h3>
            <ul className="border p-2 rounded dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                {myProject.teams?.map((team) => {
                    const assignedTask = employeeTasks.find((task) => task.assignedTo._id === team._id);
                    const isExpanded = expandedEmployee === team._id;

                    return (
                        <li key={team._id} className="p-3 border-b last:border-none dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{team.username}  {assignedTask ? ` - ${assignedTask.status}` : ""}</span>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${assignedTask ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {assignedTask ? "Task Assigned" : "No Task"}
                                    </span>
                                    <button
                                        onClick={() => toggleExpand(team._id)}
                                        className={`px-3 py-1 rounded text-xs text-white ${isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        {isExpanded ?  "Close" : assignedTask ? "View" : "Create"}
                                    </button>

                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                                    {assignedTask ? (
                                        <div>
                                            <p><strong>📌 Name:</strong> {assignedTask.name}</p>
                                            <p><strong>📝 Description:</strong> {assignedTask.description}</p>
                                            <p><strong>📅 Due Date:</strong> {new Date(assignedTask.dueDate).toLocaleDateString()}</p>
                                            <p><strong>⏳ Status:</strong> {assignedTask.status}</p>
                                            {/* <ActivityLogsChart/> */}
                                        </div>
                                    ) : (
                                        //Task Assignment Form
                                        <form onSubmit={(e) => handleTaskCreation(e, team._id)} className="space-y-2">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Task Name"
                                                value={newTask.name}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
                                                required
                                            />
                                            <textarea
                                                name="description"
                                                placeholder="Task Description"
                                                value={newTask.description}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={newTask.dueDate}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="estimatedTime"
                                                placeholder="Estimated Time (hours)"
                                                value={newTask.estimatedTime}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
                                                required
                                            />
                                            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                                                Assign Task
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ProjectDetails;
