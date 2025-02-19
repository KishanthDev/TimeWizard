import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const {user,isLoggedIn} = useSelector((state) => state.user);

  if (!isLoggedIn) return <Navigate to="/" replace/>; 
  if (user.role !== role) return <Navigate to="/unauthorized" replace/>; 

  return children;
};

export default ProtectedRoute;
