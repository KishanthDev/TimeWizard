import { useDispatch,useSelector } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice.js";
import { useEffect } from "react";
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart.jsx";
import ActivityLogs from "../../components/AdminDashboard/ActivityLogs.jsx";
import { Helmet } from "react-helmet";
import OverdueTasks from "../../components/AdminDashboard/OverdueTasks.jsx";

export default function AdminDashboard() {
    const dispatch = useDispatch()
    const { allTasks ,isLoading } = useSelector((state) => state.tasks);
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])
    return (
        <>
        <Helmet>
            <title>Dashboard • TimeWizard</title>
        </Helmet>
        
            <div className="flex mr-10 ml-3 mt-10 gap-6">
            <div className="space-y-6"><OverdueTasks tasks={allTasks}/>
                <TaskStatusChart  allTasks={allTasks} isLoading={isLoading}/></div>
           <div className="flex-grow mt-3"><ActivityLogs/></div>
            
            </div>
        </>
    )
}