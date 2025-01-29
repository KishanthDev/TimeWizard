import {Routes,Route, useNavigate} from "react-router-dom"
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import { useDispatch, useSelector } from "react-redux";
import { logout, profile } from "./slices/userSlice";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import Navbar from "./components/NavBar";
import ForgotPassword from "./pages/ForgotPassword";

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
      {isLoggedIn && <Navbar handleLogout={handleLogout} />}

      <Routes>
        {!isLoggedIn ? (
          <>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </>
        ) : (
          <>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calendar />} />
          </>
        )}
      </Routes>
    </div>
  );
}


export default App;
