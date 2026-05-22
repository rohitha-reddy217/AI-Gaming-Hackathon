import { AuditLog } from "../models/AuditLog";
import { User } from "../models/User";

export const createAuditLog = async ({
  actorUserId,
  action,
  target,
  metadata
}: {
  actorUserId?: string;
  action: string;
  target: string;
  metadata?: Record<string, unknown>;
}) => {
  let actor = undefined;
  if (actorUserId) {
    const user = await User.findOne({ userId: actorUserId });
    if (user) {
      actor = user._id;
    }
  }

  await AuditLog.create({
    actor,
    action,
    target,
    metadata: metadata ?? {}
  });
};
