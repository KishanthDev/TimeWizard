import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../slices/userSlice"; // Assuming you have an action to update the user

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    contact: user.contact || "",
    jobTitle: user.jobTitle || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your validation logic here
    setErrors({}); // Clear previous errors

    if (Object.keys(errors).length === 0) {
      dispatch(updateProfile(form)); // Assuming updateProfile is an action that updates the profile
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-indigo-600">My Profile</h1>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">Name: {user.name}</div>
            <div className="text-sm font-medium text-gray-600 mb-2">Username: {user.username}</div>
            <div className="text-sm font-medium text-gray-600 mb-2">Email: {user.email}</div>
            <div className="text-sm font-medium text-gray-600 mb-2">Contact: {user.contact || "N/A"}</div>
            <div className="text-sm font-medium text-gray-600 mb-4">Job Title: {user.jobTitle || "N/A"}</div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
