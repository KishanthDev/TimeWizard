import User from "../models/user-model.js";
import crypto from "crypto"
import sendEmail from "../utils/emailUtils.js";
import { comparePassword, hashPassword } from "../utils/hashUtils.js";

const userCntrl = {}

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // Minimum 8 characters, 1 uppercase, 1 number, 1 special character
    return passwordRegex.test(password);
};

userCntrl.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist." });
      }
  
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = Date.now() + 10 * 60 * 1000;
  
      // Save OTP and expiry in the database
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
  
      // Send OTP via email
      await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for resetting your password is ${otp}. It is valid for 10 minutes.`,
      });
  
      res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  };

  userCntrl.verifyOtpAndResetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist." });
      }
      
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.",
        });
      }

      // Validate OTP and its expiry
      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP." });
      }
  
      if (user.otpExpiry < Date.now()) {
        return res.status(400).json({ error: "OTP has expired. Please request a new one." });
      }
  
      user.password = await hashPassword(newPassword);
  
      // Clear OTP fields and save the updated user
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  };
  userCntrl.resetPassword = async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
  
      // Validate input
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist." });
      }
  
      // Validate new password format
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          error:
            "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.",
        });
      }
  
      // Check if old password matches the stored password
      if (!(await comparePassword(oldPassword, user.password))) {
        return res.status(400).json({ error: "Incorrect old password." });
      }
  
      // Prevent reuse of the same password
      if (oldPassword === newPassword) {
        return res.status(400).json({ error: "New password cannot be the same as the old password." });
      }
  
      // Hash and update the new password
      user.password = await hashPassword(newPassword);
      await user.save();
  
      return res.status(200).json({ message: "Password has been updated successfully." });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  };
  


  export default userCntrl