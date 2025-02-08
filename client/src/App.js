import {Routes,Route, useNavigate} from "react-router-dom"
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import { useDispatch, useSelector } from "react-redux";
import { logout, profile } from "./slices/userSlice";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import Navbar from "./components/NavBar";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProjectPage from "./pages/admin/ProjectPage";
import EmployeesPage from "./pages/admin/EmployeePage";
import TaskDetailsPage from "./pages/employee/TaskDetailsPage";
import TopNavbar from "./components/TopNavBar";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = ()=> {
    dispatch(logout())
    navigate("/")
  }
  useEffect(()=>{
    dispatch(profile())
  },[dispatch])

  if(localStorage.getItem("token")&&!isLoggedIn){
    return <>...loading</>
  }

  return (
    <div>
      {isLoggedIn && <><TopNavbar handleLogout={handleLogout}/><Navbar  /></>}

      <div className={isLoggedIn?"ml-56 pt-16":""}>
      <Routes>
        {!isLoggedIn ? (
          <>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </>
        ) : (
          <>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/emp" element={<ProtectedRoute role="admin"><EmployeesPage/></ProtectedRoute>}/>
          <Route path="/project" element={<ProtectedRoute role="admin"><ProjectPage/></ProtectedRoute>}/>
          <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee-task" element={<ProtectedRoute role="employee"><TaskDetailsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calendar />} />
          </>
        )}
      </Routes>
      </div>
    </div>
  );
}


export default App;
