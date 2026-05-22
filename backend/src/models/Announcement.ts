import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  visibility: "all" | "student" | "professional" | "startup" | "admin";
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    visibility: { type: String, required: true, enum: ["all", "student", "professional", "startup", "admin"] }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>("Announcement", announcementSchema);
