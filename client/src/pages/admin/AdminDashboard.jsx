import { useDispatch } from "react-redux";
import EmployeeStatusChart from "../../components/AdminDashboard/EmployeeStatusChart.jsx";
import { fetchAllTasks } from "../../slices/taskSlice.js";
import { useEffect } from "react";

export default function AdminDashboard() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])
    return (
        <>
            <h1>Admin</h1>
            <EmployeeStatusChart/>
        </>
    )
}