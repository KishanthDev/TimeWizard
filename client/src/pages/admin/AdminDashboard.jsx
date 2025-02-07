import { useDispatch } from "react-redux";
import { fetchAllTasks } from "../../slices/taskSlice.js";
import { useEffect } from "react";
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart.jsx";

export default function AdminDashboard() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])
    return (
        <>
            <h1>Admin</h1>
            <TaskStatusChart/>
        </>
    )
}