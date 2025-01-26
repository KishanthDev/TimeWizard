import { Schema,model } from "mongoose";
const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:["employee","admin"],
        default:"employee"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    contact: {
        type: String,
        trim: true,
        default: null,
    },
    profileImage: {
        filePath: { type: String },
        publicId: { type:String }
      },
    jobTitle:{
        type: String,
        trim: true,
        default: null,
    },
    otp: String,
    otpExpiry: Date,
    subscription: {
        plan: { type: String, enum: ['free', 'premium'], default: 'free' },
        startDate: { type: Date },
        endDate: { type: Date },
        status: { type: String, enum: ['active', 'expired'], default: 'active' },
    },
},{timestamps:true})
const User = model("User",userSchema)
export default User