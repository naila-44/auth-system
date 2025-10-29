import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
 resetToken: {
    type:String,
    required:false,
  },
 resetTokenExpiry: {
    type:String,
    required:false,
  },
 
},
{timestamps:true});

const User = mongoose.models.User || mongoose.model("User", userSchema); 
export default User;
