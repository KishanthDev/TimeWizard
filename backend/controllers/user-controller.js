import User from "../models/user-model.js"
import jwt from "jsonwebtoken"
import fs from "fs"
import csv from "csv-parser"
import { validationResult } from "express-validator"
import { comparePassword, hashPassword } from "../utils/hashUtils.js"
import cloudinary from "../config/cloudinary.js"

const userCntrl = {}

userCntrl.signup = async (req, res) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(200).json({ error: "Email or username is already taken." });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    if (user.role === "employee") {
      delete user.subscription;
    }
    await user.save()
    res.status(200).json({ message: "User created successfully",user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. Try again.", message: err.message });
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
      role:"employee",
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

    if (!users || users.length === 0) {
      return res.status(200).json({ users: [], message: "No users found." });
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


userCntrl.edit= async (req, res) => {
  try {
    const id = req.params.id;
    const { name, username, contact, jobTitle, password } = req.body;

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for unique username if it's being updated
    if (username && username !== currentUser.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Username already exists, try picking another name" });
      }
    }

    let profileImage = currentUser.profileImage || null;

    // Handle profile image update
    if (req.file) {
      if (profileImage?.publicId) {
        await cloudinary.uploader.destroy(profileImage.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        resource_type: "auto",
      });

      profileImage = {
        filePath: result.secure_url,
        publicId: result.public_id,
      };
    }

    // Only hash the password if it's provided
    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password)
    }

    // Update only the provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (contact) updateFields.contact = contact;
    if (jobTitle) updateFields.jobTitle = jobTitle;
    if (password) updateFields.password = hashedPassword;
    if (profileImage) updateFields.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

  
  userCntrl.importUsersFromCSV = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }
  
    const users = [];
    const errors = [];
    const filePath = req.file.path;
  
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        users.push(row);
      })
      .on("end", async () => {
        try {
          const newUsers = [];
  
          for (const user of users) {
            const { name, password, username, email } = user;
  
            if (!name || !password || !username || !email) {
              errors.push({ user, error: "Missing required fields" });
              continue;
            }
  
            // Check for existing user
            const existingUser = await User.findOne({
              $or: [{ username }, { email }],
            });
  
            if (existingUser) {
              errors.push({ user, error: "Username or Email already exists" });
              continue;
            }
  
            // Create new user
            newUsers.push({ name, password, username, email });
          }
  
          // Insert valid users into DB
          if (newUsers.length > 0) {
            await User.insertMany(newUsers);
          }
  
          // Delete temp file
          fs.unlinkSync(filePath);
  
          res.status(201).json({
            message: `${newUsers.length} users uploaded successfully`,
            uploadedUsers: newUsers,
            errors,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error", error });
        }
      });
  };

  userCntrl.remove = async (req, res) => {
    const { id } = req.params;
      try {
          const deletedUser = await User.findByIdAndDelete(id);
          if (!deletedUser) {
              return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json({ message: "User deleted successfully"});
      } catch (error) {
          res.status(500).json({ message: "Internal server error" });
      }
  };
  
export default userCntrl