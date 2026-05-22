import mongoose, { Schema, Document } from "mongoose";

export interface ISponsorLead extends Document {
  company: string;
  email: string;
  contact: string;
  phone: string;
  message: string;
}

const sponsorLeadSchema = new Schema<ISponsorLead>(
  {
    company: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export const SponsorLead = mongoose.model<ISponsorLead>("SponsorLead", sponsorLeadSchema);
