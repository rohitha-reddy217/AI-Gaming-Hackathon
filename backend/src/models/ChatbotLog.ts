import mongoose, { Schema, Document } from "mongoose";

export interface IChatbotLog extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  response: string;
}

const chatbotLogSchema = new Schema<IChatbotLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    response: { type: String, required: true }
  },
  { timestamps: true }
);

export const ChatbotLog = mongoose.model<IChatbotLog>("ChatbotLog", chatbotLogSchema);
