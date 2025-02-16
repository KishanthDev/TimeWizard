import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordWithOldPassword,resetState } from "../../slices/forgotPasswordSlice";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      dispatch(resetState()); // Reset Redux state
      return;
    }

    dispatch(resetPasswordWithOldPassword({ email, oldPassword, newPassword }));
  };
  if(error){
    toast.error(error)
  }
  if(success){
    toast.success("Password updated successfully!" , {position:"bottom-right"})
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Old Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-gray-700 text-white"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-gray-700 text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
