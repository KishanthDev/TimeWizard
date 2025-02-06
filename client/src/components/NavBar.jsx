import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  const { user } = useSelector(state => state.user);
  const location = useLocation(); // Get current route

  const getLinkClass = (path) => 
    location.pathname === path ? "text-yellow-300 border-b-2 border-yellow-300" : "text-white";

  return (
    <ul className="flex space-x-4 bg-gray-800 p-4 text-white">
      {user.role === "admin" ? (
        <>
          <li>
            <Link to="/admin" className={`px-3 py-1 ${getLinkClass("/admin")}`}>Dashboard</Link>
          </li>
          <li>
            <Link to="/project" className={`px-3 py-1 ${getLinkClass("/project")}`}>Project</Link>
          </li>
          <li>
            <Link to="/emp" className={`px-3 py-1 ${getLinkClass("/emp")}`}>Employee</Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/employee" className={`px-3 py-1 ${getLinkClass("/employee")}`}>Dashboard</Link>
          </li>
          <li>
            <Link to="/reports" className={`px-3 py-1 ${getLinkClass("/reports")}`}>Reports</Link>
          </li>
          <li>
            <Link to="/employee-task" className={`px-3 py-1 ${getLinkClass("/employee-task")}`}>Task</Link>
          </li>
        </>
      )}
      <li>
        <Link to="/calendar" className={`px-3 py-1 ${getLinkClass("/calendar")}`}>Calendar</Link>
      </li>
      <li>
        <Link to="/profile" className={`px-3 py-1 ${getLinkClass("/profile")}`}>Profile</Link>
      </li>
      <li>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </li>
    </ul>
  );
}
