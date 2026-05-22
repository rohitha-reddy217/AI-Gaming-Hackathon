import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../types/roles";

export const signJwt = ({
  userId,
  role,
  email,
  name
}: {
  userId: string;
  role: UserRole;
  email: string;
  name?: string;
}) => {
  return jwt.sign({ userId, role, email, name }, env.JWT_SECRET, { expiresIn: "7d" });
};
