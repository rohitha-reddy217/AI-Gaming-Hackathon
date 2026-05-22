import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  team: mongoose.Types.ObjectId;
  githubLink?: string;
  pptUrl?: string;
  demoVideo?: string;
  apkBuild?: string;
  zipBuild?: string;
  submittedAt?: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true, unique: true },
    githubLink: { type: String },
    pptUrl: { type: String },
    demoVideo: { type: String },
    apkBuild: { type: String },
    zipBuild: { type: String },
    submittedAt: { type: Date }
  },
  { timestamps: true }
);

export const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);
