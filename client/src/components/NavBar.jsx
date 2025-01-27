import { Link } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  return (
    <ul className="flex space-x-4 bg-gray-800 p-4 text-white">
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/reports">Reports</Link>
      </li>
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
