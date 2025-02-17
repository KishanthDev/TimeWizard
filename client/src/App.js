import {Routes,Route, useNavigate} from "react-router-dom"
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
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
import ActivityLog from "./pages/admin/ActivityPage";
import ActivityFullCalendar from "./pages/admin/ActivityFullCalendar";
import Settings from "./pages/Settings";
import TaskApprovals from "./pages/employee/TaskApprovals";
import TaskReview from "./pages/admin/TaskReview";
import { fetchAllTasks } from "./slices/taskSlice";
import { fetchEmployees } from "./slices/employeeSlice";
import { fetchProjects } from "./slices/projectSlice";
import GeneralChat from "./pages/employee/GeneralChat";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./pages/admin/CheckoutForm";
import SubscriptionPlans from "./pages/admin/SubcriptionPlans";
import Success from "./components/admin-payments/Success";
import Cancel from "./components/admin-payments/Cancel";
import { fetchSubscriptionStatus } from "./slices/subscriptionSlice";
import ActivityPreview from "./components/admin-payments/ActivityPreview";
import CalendarPreview from "./components/admin-payments/CalendarPreview";
import GeneralChatPreview from "./components/admin-payments/GeneralChatPreview";
import EmployeeTaskCalendar from "./pages/employee/Calendar";
import UnauthorizedPage from "./components/UnAuthorized";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.user);

  const stripePromise = loadStripe("pk_test_51QsJIsCAuzyXYsf5urQoRitfwrxRtMbUsHp03MeCi5myWju9AgpQPlYuALVMRuXqjMArsKQCU2TOo2lPczp1s9W400BbXKOBC5");

  const handleLogout = ()=> {
    dispatch(logout())
    navigate("/")
  }
  useEffect(()=>{
    dispatch(profile())
  },[dispatch])

  useEffect(()=>{
    dispatch(fetchProjects())
    dispatch(fetchEmployees({limit:25}))
    dispatch(fetchAllTasks())
    dispatch(fetchSubscriptionStatus())
  },[dispatch])

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  

  if(localStorage.getItem("token")&&!isLoggedIn){
    return <>...loading</>
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 flex flex-col">
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      ) : (
        <>
          <TopNavbar handleLogout={handleLogout} />
          <div className="flex flex-1">
            <Navbar />
            <div className="flex-1 p-4 overflow-auto ml-56 pt-16">
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/emp" element={<ProtectedRoute role="admin"><EmployeesPage /></ProtectedRoute>} />
                <Route path="/activities" element={<ProtectedRoute role="admin"><ActivityLog /></ProtectedRoute>} />
                <Route path="/activity-preview" element={<ProtectedRoute role="admin"><ActivityPreview /></ProtectedRoute>} />
                <Route path="/activity-calendar" element={<ProtectedRoute role="admin"><ActivityFullCalendar /></ProtectedRoute>} />
                <Route path="/calendar-preview" element={<ProtectedRoute role="admin"><CalendarPreview /></ProtectedRoute>} />
                <Route path="/task-review" element={<ProtectedRoute role="admin"><TaskReview /></ProtectedRoute>} />
                <Route path="/project" element={<ProtectedRoute role="admin"><ProjectPage /></ProtectedRoute>} />
                <Route path="/subscribe" element={<ProtectedRoute role="admin"><SubscriptionPlans/></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute role="admin"><Elements stripe={stripePromise}><CheckoutForm /></Elements></ProtectedRoute>} />
                <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
                <Route path="/task-approvals" element={<ProtectedRoute role="employee"><TaskApprovals /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute role="employee"><GeneralChat /></ProtectedRoute>} />
                <Route path="/chat-preview" element={<ProtectedRoute role="employee"><GeneralChatPreview /></ProtectedRoute>} />
                <Route path="/employee-task" element={<ProtectedRoute role="employee"><TaskDetailsPage /></ProtectedRoute>} />
                <Route path="/employee-calendar" element={<ProtectedRoute role="employee"><EmployeeTaskCalendar /></ProtectedRoute>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/success" element={<Success/>}/>
                <Route path="/cancel" element={<Cancel/>}/>
                <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;