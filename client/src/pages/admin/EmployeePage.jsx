import { ToastContainer } from "react-toastify";
import EmployeeList from "../../components/employee/EmployeeList";
const EmployeesPage = () => {
    return (
        <div>
            <ToastContainer />
            <EmployeeList />
        </div>
    );
};

export default EmployeesPage;
