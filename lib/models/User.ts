import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

const User = mongoose.models.User || model<IUser>("User", UserSchema);
export default User;
