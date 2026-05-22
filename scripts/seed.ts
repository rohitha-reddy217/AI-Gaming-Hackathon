import mongoose from "mongoose";
import { connectDatabase } from "../backend/src/config/db";
import { User } from "../backend/src/models/User";
import { Team } from "../backend/src/models/Team";
import { generateId } from "../backend/src/utils/ids";
import bcrypt from "bcryptjs";

const run = async () => {
  await connectDatabase();
  const admin = await User.create({
    userId: generateId(),
    role: "admin",
    name: "Admin",
    email: "admin@incuxai.com",
    passwordHash: await bcrypt.hash("ChangeMeNow!", 10)
  });

  await Team.create({
    teamId: generateId(),
    teamName: "Neon Squad",
    category: "student",
    leader: admin._id,
    members: [],
    projectDetails: {
      title: "AI Arena",
      theme: "Cyberpunk PvP",
      techStack: ["Next.js", "OpenAI"],
      description: "Adaptive AI opponents and real-time analytics."
    },
    paymentStatus: "pending",
    discordVerified: false
  });

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
