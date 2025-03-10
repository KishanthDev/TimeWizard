import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/userSlice";
import validator from "validator";
import { ToastContainer,toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    usernameorEmail: "",
    password: "",
  });

  const [clientSideErrors, setClientSideErrors] = useState({});
  const errors = {};

  const runClientSideValidation = () => {
    if (!form.usernameorEmail) {
      errors.usernameorEmail = "Enter a username or email";
    }
    if (!form.password) {
      errors.password = "Enter a password";
    } else if (!validator.isStrongPassword(form.password)) {
      errors.password = "Password is weak";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientSideValidation();
    if (Object.keys(errors).length > 0) {
      setClientSideErrors(errors);
    } else {
      setClientSideErrors({}); 

      try {
        await dispatch(login({ credentials: form, navigate })).unwrap()
      } catch (err) {
        toast.error("Invalid username or password", { position: "top-right" });
      }
    }
  };

  return (
    <div>
      {/* Login Form Section */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>
      <ToastContainer/>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="usernameorEmail" className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
          <input
            type="text"
            id="usernameorEmail"
            value={form.usernameorEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {clientSideErrors.usernameorEmail && (
            <span className="text-red-500 text-sm">{clientSideErrors.usernameorEmail}</span>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {clientSideErrors.password && (
            <span className="text-red-500 text-sm">{clientSideErrors.password}</span>
          )}
        </div>

        <p className="text-right">
          <span
          onClick={handleForgotPasswordClick}
          className="text-blue-500 text-sm  text-right inline-block cursor-pointer hover:underline"
          >
          Forgot Password?
          </span>
        </p>

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
