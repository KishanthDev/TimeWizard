import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../slices/userSlice";
import { FiEdit } from "react-icons/fi";

export default function Profile() {
  const { user, isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(user.profileImage?.filePath || "");
  const [form, setForm] = useState({
    profileImage: image,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview image
      setForm((prev) => ({ ...prev, profileImage: file })); // Store file in form data
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (form.name.length < 5 || form.name.length > 15) {
      newErrors.name = "Name must be between 5 and 15 characters.";
    }

    // Username validation
    if (form.username.length < 5 || form.username.length > 15) {
      newErrors.username = "Username must be between 5 and 15 characters.";
    }

    // Contact validation (Indian phone number)
    const phoneRegex = /^[1-9]{1}[0-9]{9}$/; // India phone number pattern
    if (!phoneRegex.test(form.contact)) {
      newErrors.contact = "Contact must be a valid 10-digit Indian phone number.";
    }

    // Job Title validation
    if (form.jobTitle.length < 2 || form.jobTitle.length > 20) {
      newErrors.jobTitle = "Job Title must be between 2 and 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate the form before submission
    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("contact", form.contact);
      formData.append("jobTitle", form.jobTitle);
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage); // Add the image file to FormData
      }

      try {
        await dispatch(updateProfile(formData));
        setIsEditing(false);
      } catch (error) {
        console.error("Error submitting profile:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-indigo-600">My Profile</h1>
        </div>

        {/* Show the server error message if exists */}
        {error && (
          <div className="text-red-600 text-center mb-4 bg-red-100 border-l-4 border-red-500 p-3 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
            <img src={image} alt="Profile" className="object-cover w-full h-full" />
            {isEditing && (
              <label htmlFor="imageInput" className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 cursor-pointer">
                <FiEdit className="text-white text-xl" />
              </label>
            )}
            <input
              type="file"
              id="imageInput"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-600">Name:</div>
            <div className="text-sm text-gray-800">{user.name}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-600">Username:</div>
            <div className="text-sm text-gray-800">{user.username}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-600">Email:</div>
            <div className="text-sm text-gray-800">{user.email}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-600">Contact:</div>
            <div className="text-sm text-gray-800">{user.contact || "N/A"}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-600">Job Title:</div>
            <div className="text-sm text-gray-800">{user.jobTitle || "N/A"}</div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && <div className="text-red-600 text-sm">{errors.username}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  id="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.contact && <div className="text-red-600 text-sm">{errors.contact}</div>}
              </div>

              <div className="mb-6">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.jobTitle && <div className="text-red-600 text-sm">{errors.jobTitle}</div>}
              </div>

              <button
                disabled={isLoading || Object.keys(errors).length > 0}
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <button
              onClick={() => setIsEditing(false)}
              className="w-full mt-2 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        )}

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
