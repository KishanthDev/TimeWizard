import User from "../models/user-model.js"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import TempUser from "../models/tempUser-model.js"
import sendEmail from "../utils/emailUtils.js"
import { comparePassword, hashPassword } from "../utils/hashUtils.js"

const userCntrl = {}

userCntrl.signup = async (req, res) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
  const { name, username, email, password,role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username is already taken." });
    }

    const existingTempUser = await TempUser.findOne({ $or: [{ email }, { username }] });
    if (existingTempUser) {
      return res.status(400).json({ error: "Email or username is already being used in an ongoing signup process." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); 
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    const hashedPassword = await hashPassword(password);

    const tempUser = new TempUser({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
    });
    const countDocuments = await User.countDocuments()
    if (countDocuments === 0) {
        tempUser.role = "admin";
    } else if (tempUser.role === "admin") {
        return res.status(401).json({ error: "Admin role can only be assigned to the first user." });
    }  
    await tempUser.save();

    await sendEmail({
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    })

    res.status(200).json({ message: "OTP sent to email. Verify to complete signup." });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. Try again.", message: err.message });
  }
};

userCntrl.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({ error: "No signup process found for this email." });
    }

    if (tempUser.otp !== parseInt(otp) || Date.now() > tempUser.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const user = new User({
      name: tempUser.name,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      role:tempUser.role
    });

    await user.save();

    await TempUser.deleteOne({ email });

    res.status(201).json({ message: "Account created successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Verification failed. Try again.", message: err.message });
  }
};

userCntrl.login = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {usernameorEmail,password} = req.body
    try {
      const user = await User.findOne({$or:[{username:usernameorEmail},{email:usernameorEmail}]})
      if(!user){
        return res.status(404).json({error:"Invalid username or email"})
      }
      const hashedpassword = await comparePassword(password,user.password)
      if(!hashedpassword){
        return res.status(404).json({error:"Invalid password"})
      }
      if(!user.isVerified){
        return res.status(403).json({error:"Contact the admin"})
      }
      const token = jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{expiresIn:"7d"})
      res.status(201).json({token,user})
    } catch (err) {
        res.status(500).json({error:"Something went wrong",message:err})
    }
}

userCntrl.get = async (req, res) => {
  try {

    if (req.currentUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "name"; 
    const order = req.query.order === "desc" ? -1 : 1; 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const sortQuery = { [sortBy]: order };

    const regex = new RegExp(search, "i");

    const searchQuery = {
      $or: [
        { name: regex },
        { username: regex },
        { email: regex },
      ],
    };

    const skip = (page - 1) * limit;

    const users = await User.find(searchQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(searchQuery);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

userCntrl.profile = async (req,res) => {
    try {
        const user = await User.findOne({_id:req.currentUser.id})
        res.json(user)
    } catch (err) {
        res.status(500).json({error:err})
    }
}

userCntrl.verifyUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.isVerified = !user.isVerified;
  
      await user.save();
  
      res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
  };

export default userCntrl