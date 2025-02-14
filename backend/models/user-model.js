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
        plan: { type: String, enum: ["free", "basic", "premium"], default: "free" }, // Only for admins
        status: { type: String, enum: ["active", "canceled"], default: "active" }, // Subscription status
        stripeCustomerId: { type: String }, // Store Stripe customer ID
        stripeSubscriptionId: { type: String }, // Store Stripe subscription ID
      },
    projectsCreated: { type: Number, default: 0 },
    tasksCreated: { type: Number, default: 0 },
},{timestamps:true})
const User = model("User",userSchema)
export default User