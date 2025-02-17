import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function TopNavbar({ handleLogout }) {
  const { user } = useSelector((state) => state.user);
  const { plan } = useSelector((state) => state.subscription);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="dark:bg-gray-800 dark:text-white bg-gray-200 text-black flex justify-between items-center px-6 py-3 fixed top-0 left-0 right-0 z-10 shadow-md">
      {/* Company Name + Crown for Premium Users */}
      <h1 className="text-xl font-bold flex items-center">
        TimeWizard {plan === "premium" && <span className="ml-2 text-yellow-500 text-xl">👑</span>}
      </h1>

      {/* Profile Section with Upgrade Button near it */}
      <div className="flex items-center space-x-4">
        {(user.role === "admin") && (
          <Link
            to="/subscribe"
            className="bg-green-500 text-white text-sm px-2 py-1 font-medium hover:bg-green-600"
          >
            UPGRADE 🚀
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img
              src={user.profileImage.filePath || "/default-profile.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 dark:text-gray-100 dark:bg-gray-700 bg-white text-gray-800 rounded shadow-lg">
              <Link to="/profile" className="block px-4 py-2 dark:hover:bg-gray-500 hover:bg-gray-200">
                Profile
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 dark:hover:bg-gray-500 hover:bg-gray-200">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
