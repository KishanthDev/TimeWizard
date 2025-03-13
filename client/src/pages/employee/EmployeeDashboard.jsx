import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice";
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart";
import { useEffect, useState } from "react";
import EmployeeDashboardTask from "../../components/employee-dashboard/EmployeeDashboardTask";
import ChatPopup from "../../components/employee-task/ChatPopUp";
import Notes from "../../components/employee-dashboard/Notes";
import { Helmet } from "react-helmet";

export default function EmployeeDashboard() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const {allTasks,isLoading} = useSelector(state=>state.tasks)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    const handleChatOpen = () => {
        setIsChatOpen(true);
    };
    
    const handleChatClose = () => {
        setIsChatOpen(false);
    };

    const handleProjectId = (id) => {
        setProjectId(id);
    };

    return (
        <div className="flex flex-col p-4">
            <Helmet>
            <title>Dashboard • TimeWizard</title>
        </Helmet>
            <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>

            {/* Two-column layout for Task Status and Notes */}
            <div className="flex mr-5 gap-8">
                <div className="flex">
                    <TaskStatusChart allTasks={allTasks} isLoading={isLoading}/>
                </div>
                <div className="flex-1">
                    <Notes />
                </div>
            </div>

            {/* Task List */}
            <EmployeeDashboardTask projectId={handleProjectId} isOpen={handleChatOpen} />

            {/* Chat Popup takes remaining right space */}
            {isChatOpen && projectId && (
                <div>
                    <ChatPopup projectId={projectId} isOpen={isChatOpen} onClose={handleChatClose} />
                </div>
            )}
        </div>
    );
}
