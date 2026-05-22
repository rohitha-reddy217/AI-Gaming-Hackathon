import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  teamId: string;
  teamName: string;
  category: "student" | "professional" | "startup";
  leader: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  projectDetails: {
    title: string;
    theme: string;
    techStack: string[];
    description: string;
  };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  discordVerified: boolean;
  qrTicketUrl?: string;
  approvalStatus: "pending" | "approved" | "rejected";
}

const teamSchema = new Schema<ITeam>(
  {
    teamId: { type: String, required: true, unique: true, index: true },
    teamName: { type: String, required: true },
    category: { type: String, required: true, enum: ["student", "professional", "startup"] },
    leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    projectDetails: {
      title: { type: String, required: true },
      theme: { type: String, required: true },
      techStack: [{ type: String, required: true }],
      description: { type: String, required: true }
    },
    paymentStatus: { type: String, required: true, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    discordVerified: { type: Boolean, default: false },
    qrTicketUrl: { type: String },
    approvalStatus: { type: String, required: true, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>("Team", teamSchema);

