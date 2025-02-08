import { useDispatch } from "react-redux"
import { fetchAllTasks } from "../../slices/taskSlice"
import TaskStatusChart from "../../components/AdminDashboard/TaskStatusChart"
import { useEffect, useState } from "react"
import EmployeeDashboardTask from "../../components/employee-dashboard/EmployeeDashboardTask"
import ChatPopup from "../../components/employee-task/ChatPopUp"

export default function EmployeeDashboard(){
    const [isChatOpen,setIsChatOpen] = useState(false)
    const [projectId,setProjectId] = useState(null)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchAllTasks())
    },[dispatch])

    const handleChatOpen = ()=>{
        setIsChatOpen(true)
    }
    const handleChatClose = ()=>{
        setIsChatOpen(false)
    }

    const handleProjectId = (id)=>{
        setProjectId(id)
    }
    return (
        <>
            <h1>Employee</h1>
            <TaskStatusChart/>
            <EmployeeDashboardTask projectId={handleProjectId} isOpen={handleChatOpen}/>
            {(isChatOpen&&projectId)&&<ChatPopup projectId={projectId} isOpen={isChatOpen} onClose={handleChatClose}/>}
        </>
    )
}