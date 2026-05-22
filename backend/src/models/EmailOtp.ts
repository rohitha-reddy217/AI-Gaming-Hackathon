import mongoose, { Schema, Document } from "mongoose";

export interface IEmailOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
}

const emailOtpSchema = new Schema<IEmailOtp>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailOtp = mongoose.model<IEmailOtp>("EmailOtp", emailOtpSchema);
