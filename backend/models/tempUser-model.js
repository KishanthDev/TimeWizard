import { Schema,model } from "mongoose";
const tempUserSchema = new Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  role:{
    type:String,
    enum:["employee","admin"],
    default:"employee"
},
  otp: Number,
  otpExpiry: Date,
});

const TempUser = model("TempUser", tempUserSchema)
export default TempUser
