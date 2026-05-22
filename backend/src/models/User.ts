import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../types/roles";

export interface IUser extends Document {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  mobile?: string;
  discordId?: string;
  avatar?: string;
  passwordHash?: string;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true, enum: ["admin", "student", "professional", "startup", "sponsor"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    mobile: { type: String },
    discordId: { type: String, index: true },
    avatar: { type: String },
    passwordHash: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
