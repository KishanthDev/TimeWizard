import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const {user,isLoggedIn} = useSelector((state) => state.user);

  if (!isLoggedIn) return <Navigate to="/" />; 
  if (user.role !== role) return <Navigate to="/unauthorized" />; 

  return children;
};

export default ProtectedRoute;
