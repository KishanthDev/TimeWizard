import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../slices/userSlice";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user, isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
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

  useEffect(() => {
    if (error && !isSuccess) {
      toast.error(error, { position: "top-right" });
      setIsSuccess(false);
    } else if (isSuccess) {
      toast.success("Profile updated successfully!", { position: "top-right" })
    }
  }, [error, isSuccess]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Update the preview
      const formData = new FormData();
      formData.append("profileImage", file);
      await dispatch(updateProfile(formData));
      setIsSuccess(true); 
    }
  };

  const handleDeleteImage = () => {
    setImage(""); // Clear the image preview
    setForm((prev) => ({ ...prev, profileImage: "" })); // Remove image from form data
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.name.length < 5 || form.name.length > 15) {
      newErrors.name = "Name must be between 5 and 15 characters.";
    }
    if (form.username.length < 5 || form.username.length > 15) {
      newErrors.username = "Username must be between 5 and 15 characters.";
    }
    const phoneRegex = /^[1-9]{1}[0-9]{9}$/; // India phone number pattern
    if (!phoneRegex.test(form.contact)) {
      newErrors.contact = "Contact must be a valid 10-digit Indian phone number.";
    }
    if (form.jobTitle.length < 2 || form.jobTitle.length > 20) {
      newErrors.jobTitle = "Job Title must be between 2 and 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("contact", form.contact);
      formData.append("jobTitle", form.jobTitle);

      await dispatch(updateProfile(formData));
      error?setIsSuccess(false):setIsSuccess(true)
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-6 ">
        <div className="flex items-center justify-between">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 mb-2">
              <img src={image || "/default-profile.png"} alt="Profile" className="object-cover w-full h-full" />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              <label htmlFor="imageInput" className="flex items-center justify-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md cursor-pointer hover:bg-indigo-700">
                <FiEdit className="mr-1" /> Edit
              </label>
              <input
                type="file"
                id="imageInput"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                onClick={handleDeleteImage}
                className="flex items-center justify-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                <FiTrash2 className="mr-1" /> Delete
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div className="flex justify-center items-center w-full">
            <span className="block text-2xl font-bold text-gray-800 uppercase">
              {user.name}
            </span>
          </div>
        </div>

        {/* Other Fields */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username:</label>
            <span className="text-sm text-gray-800">{user.username}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email:</label>
            <span className="text-sm text-gray-800">{user.email}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contact:</label>
            <span className="text-sm text-gray-800">{user.contact || "N/A"}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Job Title:</label>
            <span className="text-sm text-gray-800">{user.jobTitle || "N/A"}</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}

        {isEditing && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.username && <div className="text-red-600 text-sm">{errors.username}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    id="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.contact && <div className="text-red-600 text-sm">{errors.contact}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">JobTitle</label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.jobTitle && <div className="text-red-600 text-sm">{errors.jobTitle}</div>}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
