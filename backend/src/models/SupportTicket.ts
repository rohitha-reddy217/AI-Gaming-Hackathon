import mongoose, { Schema, Document } from "mongoose";

export interface ISupportTicket extends Document {
  ticketId: string;
  user: mongoose.Types.ObjectId;
  category: "registration" | "payment" | "technical" | "general";
  status: "open" | "in_progress" | "resolved";
  messages: {
    sender: "user" | "admin";
    message: string;
    createdAt: Date;
  }[];
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true, enum: ["registration", "payment", "technical", "general"] },
    status: { type: String, required: true, enum: ["open", "in_progress", "resolved"], default: "open" },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: () => new Date() }
      }
    ]
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>("SupportTicket", supportTicketSchema);
