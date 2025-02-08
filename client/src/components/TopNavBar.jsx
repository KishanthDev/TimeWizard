import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function TopNavbar({ handleLogout }) {
  const { user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-gray-800 text-white flex justify-between items-center px-6 py-3 fixed top-0 left-0 right-0 z-10 shadow-md">
      {/* Company Name */}
      <h1 className="text-xl font-bold">TimeWizard</h1>

      {/* Profile Section */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
          <img
            src={user.profileImage.filePath || "/default-profile.png"} // Replace with user profile URL
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
