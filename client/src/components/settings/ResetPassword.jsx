import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      
      setMessage("Password updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
