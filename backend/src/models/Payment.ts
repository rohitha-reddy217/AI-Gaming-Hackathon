import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionId: string;
  team: mongoose.Types.ObjectId;
  amount: number;
  status: "created" | "paid" | "failed" | "refunded";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  gstInvoiceUrl?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["created", "paid", "failed", "refunded"] },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String },
    gstInvoiceUrl: { type: String }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
