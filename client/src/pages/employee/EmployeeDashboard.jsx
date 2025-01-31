import { useSelector } from "react-redux"

export default function EmployeeDashboard(){
    const {tasks} = useSelector(state=>state.tasks)
    

    return(
        <>
            <h1>Dashboard</h1>
            <h4>Task assigned - {tasks?.length||0}</h4>   
        </>
    )
}