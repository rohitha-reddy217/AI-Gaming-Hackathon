import mongoose, { Schema, Document } from "mongoose";

export interface ISponsor extends Document {
  name: string;
  sponsorTier: "platinum" | "gold" | "silver" | "community";
  logo: string;
  links: string[];
}

const sponsorSchema = new Schema<ISponsor>(
  {
    name: { type: String, required: true },
    sponsorTier: { type: String, required: true, enum: ["platinum", "gold", "silver", "community"] },
    logo: { type: String, required: true },
    links: [{ type: String }]
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model<ISponsor>("Sponsor", sponsorSchema);
