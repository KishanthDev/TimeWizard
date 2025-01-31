import React, { useState,useEffect } from "react";
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
            await dispatch(sendForgotPasswordEmail(email)).unwrap()
            setOtpSent(true);
            setOtpExpired(false);
            setTimeLeft(600);
            toast.success("Otp sent to your email",{position:"top-right"})
        } catch (error) {
            toast.error("Account not registered in this email",{position:"top-right"})
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
    setErrors({})
    e.preventDefault();
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    if (!password) newErrors.password = "Password is required";
    if (!validator.isStrongPassword(password))
      newErrors.password = "Password must be min of 8 char,uppercase,num,special character.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
        try {
            await dispatch(verifyOtpAndResetPassword({ email, otp, newPassword: password })).unwrap()
            toast.success("Password updated",{position:"top-right"})
        } catch (error) {
            toast.error("Invalid Otp",{position:"top-right"})
        }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <ToastContainer/>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? "sending..." : otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* OTP Field */}
          {otpSent && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full px-4 py-2 border rounded ${errors.otp ? "border-red-500" : "border-gray-300"}`}
                disabled={otpExpired}
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
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Resend OTP
            </button>
          )}

          {/* Password Field */}
          {otpSent && (
            <>
              <div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (<p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          {otpSent && (
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Reset Password
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
