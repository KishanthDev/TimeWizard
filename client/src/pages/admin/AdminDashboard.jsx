import { useDispatch } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice.js";
import { useEffect } from "react";
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart.jsx";
import ActivityLogs from "../../components/AdminDashboard/ActivityLogs.jsx";

export default function AdminDashboard() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])
    return (
        <>
            <h1>Admin</h1>
            <div className="flex mr-10 ml-3 gap-6">
                <div className=""><TaskStatusChart/></div>
           <div className="flex-grow"><ActivityLogs/></div>
            
            </div>
        </>
    )
}