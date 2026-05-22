import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  actor: mongoose.Types.ObjectId;
  action: string;
  target: string;
  metadata: Record<string, unknown>;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    target: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
