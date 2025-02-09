import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  const { user } = useSelector(state => state.user);
  const location = useLocation(); // Get current route

  const getLinkClass = (path) => 
    location.pathname === path ? "text-yellow-300 border-l-4 border-yellow-300 pl-3" : "text-white";

  return (
    <div className="h-screen w-56 bg-gray-800 text-white fixed flex mt-16 flex-col p-4">
      <ul className="space-y-4">
        {user.role === "admin" ? (
          <>
            <li>
              <Link to="/admin" className={`block py-2 ${getLinkClass("/admin")}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/project" className={`block py-2 ${getLinkClass("/project")}`}>Project</Link>
            </li>
            <li>
              <Link to="/emp" className={`block py-2 ${getLinkClass("/emp")}`}>Employee</Link>
            </li>
            <li>
              <Link to="/activities" className={`block py-2 ${getLinkClass("/activities")}`}>Activity</Link>
            </li>
            <li>
              <Link to="/activity-calendar" className={`block py-2 ${getLinkClass("/activity-calendar")}`}>Calendar</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/employee" className={`block py-2 ${getLinkClass("/employee")}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/employee-task" className={`block py-2 ${getLinkClass("/employee-task")}`}>Task</Link>
            </li>
          </>
        )}
        <li>
              <Link to="/settings" className={`block py-2 ${getLinkClass("/settings")}`}>Settings</Link>
            </li>
      </ul>
    </div>
  );
}
