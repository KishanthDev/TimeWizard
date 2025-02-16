import { useState, useEffect } from "react";
import ResetPassword from "../components/settings/ResetPassword";
import { ToastContainer } from "react-toastify";

const Settings = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-10 mx-auto rounded shadow-md">
      {/* Theme Section */}
      <h2 className="text-xl font-semibold">Themes</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">Choose your theme to suit your mood.</p>
      <ToastContainer/>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
            className="w-4 h-4"
          />
          Light
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
            className="w-4 h-4"
          />
          Dark
        </label>
      </div>

      {/* Privacy Section */}
      <h2 className="text-xl font-semibold mt-6">Privacy</h2>
      <div className="mt-2 flex items-center gap-4 pb-2">
        <p className="text-gray-700 dark:text-gray-300">Change your password</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Reset Password
        </button>
      </div>

      {/* Reset Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✖
            </button>
            <ResetPassword />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
