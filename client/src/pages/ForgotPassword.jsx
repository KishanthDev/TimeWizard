import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { sendForgotPasswordEmail, verifyOtpAndResetPassword } from "../slices/forgotPasswordSlice";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [otpExpired, setOtpExpired] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setOtpExpired(true);
      toast.error("OTP expired! Request a new OTP.", { position: "top-right" });
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleSendOtp = async () => {
    if (validator.isEmail(email)) {
      try {
        await dispatch(sendForgotPasswordEmail(email)).unwrap();
        setOtpSent(true);
        setOtpExpired(false);
        setTimeLeft(600);
        toast.success("Otp sent to your email", { position: "top-right" });
      } catch (error) {
        toast.error("Account not registered with this email", { position: "top-right" });
      }
      setErrors({});
    } else {
      setErrors({ email: "Please enter a valid email address" });
    }
  };

  const handleResendOtp = async () => {
    setOtp(""); // Clear OTP input
    setTimeLeft(600); // Reset timer
    setOtpExpired(false);
    await handleSendOtp();
  };

  const handleSubmit = async (e) => {
    setErrors({});
    e.preventDefault();
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    if (!password) newErrors.password = "Password is required";
    if (!validator.isStrongPassword(password))
      newErrors.password = "Password must be min of 8 characters, include uppercase, number, and special character.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await dispatch(verifyOtpAndResetPassword({ email, otp, newPassword: password })).unwrap();
        toast.success("Password updated", { position: "top-right" });
      } catch (error) {
        toast.error("Invalid OTP", { position: "top-right" });
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer />
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center font-semibold dark:text-black text-lg mb-6">Forgot Password</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 dark:text-black border rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent}
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            {isLoading ? "sending..." : otpSent ? "OTP Sent" : "Send OTP"}
          </button>

          {/* OTP Field */}
          {otpSent && (
            <div className="space-y-1">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={otpExpired}
                className={`w-full px-4 py-2 dark:text-black border rounded-lg focus:outline-none ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              {!otpExpired ? (
                <p className="text-gray-500 text-sm mt-1">Time left: {formatTime(timeLeft)}</p>
              ) : (
                <p className="text-red-500 text-sm mt-1">OTP expired! Resend OTP.</p>
              )}
            </div>
          )}

          {/* Resend OTP Button */}
          {otpExpired && (
            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400"
            >
              Resend OTP
            </button>
          )}

          {/* Password Fields */}
          {otpSent && (
            <>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 dark:text-black py-2 border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 dark:text-black py-2 border rounded-lg focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900">
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
