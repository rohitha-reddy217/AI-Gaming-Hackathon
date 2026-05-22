import mongoose, { Schema, Document } from "mongoose";

export interface ICampusAmbassador extends Document {
  user: mongoose.Types.ObjectId;
  referralCode: string;
  points: number;
  leaderboardRank: number;
}

const campusAmbassadorSchema = new Schema<ICampusAmbassador>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    referralCode: { type: String, required: true, unique: true, index: true },
    points: { type: Number, default: 0 },
    leaderboardRank: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CampusAmbassador = mongoose.model<ICampusAmbassador>("CampusAmbassador", campusAmbassadorSchema);
