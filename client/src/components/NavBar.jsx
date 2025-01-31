import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  const { user } = useSelector(state => state.user)
  return (
    <ul className="flex space-x-4 bg-gray-800 p-4 text-white">
      {user.role === "admin" ?
        <>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/project">Project</Link>
          </li>
        </> :
        <>
          <li>
            <Link to="/employee">Dashboard</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
        </>
      }
      <li>
        <Link to="/calendar">Calendar</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </li>
    </ul>
  );
}
