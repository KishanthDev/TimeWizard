import { useDispatch } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice.js";
import { useEffect } from "react";
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart.jsx";
import ActivityLogs from "../../components/AdminDashboard/ActivityLogs.jsx";
import { Helmet } from "react-helmet";

export default function AdminDashboard() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])
    return (
        <>
        <Helmet>
            <title>Dashboard • TimeWizard</title>
        </Helmet>
            <div className="flex mr-10 ml-3 mt-10 gap-6">
                <div className=""><TaskStatusChart/></div>
           <div className="flex-grow"><ActivityLogs/></div>
            
            </div>
        </>
    )
}