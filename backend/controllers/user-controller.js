import User from "../models/user-model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"

const userCnrtl = {}
userCnrtl.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,username,email,password,role} = req.body
    try {
        const user = new User({name,username,email,password,role})
        const countDocuments = await User.countDocuments()
        if (countDocuments === 0) {
            user.role = "admin";
        } else if (user.role === "admin") {
            return res.status(401).json({ error: "Admin role can only be assigned to the first user." });
        }       
        const salt = await bcryptjs.genSalt()
        const hash = await bcryptjs.hash(password,salt)
        user.password = hash
        await user.save()
        return res.status(201).json(user)
    } catch (err) {
        res.status(500).json({error:"Something went wrong",message:err})
    }
}


userCnrtl.login = async(req,res)=>{
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
      const hashedpassword = await bcryptjs.compare(password,user.password)
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

userCnrtl.get = async (req, res) => {
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

userCnrtl.profile = async (req,res) => {
    try {
        const user = await User.findOne({_id:req.currentUser.id})
        res.json(user)
    } catch (err) {
        res.status(500).json({error:err})
    }
}

userCnrtl.verifyUser = async (req, res) => {
    try {
      const { userId } = req.params;
    if(req.currentUser.role !="admin"){
        return res.status(403).json({error:"Only admin has the permission to approve tasks"})
    }
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

export default userCnrtl