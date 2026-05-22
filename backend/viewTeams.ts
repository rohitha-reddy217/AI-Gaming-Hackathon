import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { Team } from "./src/models/Team";
import { User } from "./src/models/User";

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/incuxai";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

function printReport(teams: any[], users: any[]) {
  console.log(`📊 TOTAL REGISTERED TEAMS: ${teams.length}`);
  console.log("------------------------------------------------------------------");
  
  // Calculate statistics
  const stats = {
    categories: { student: 0, professional: 0, startup: 0 },
    payment: { pending: 0, paid: 0, failed: 0, refunded: 0 },
    approval: { pending: 0, approved: 0, rejected: 0 }
  };

  teams.forEach(t => {
    if (t.category in stats.categories) stats.categories[t.category as keyof typeof stats.categories]++;
    if (t.paymentStatus in stats.payment) stats.payment[t.paymentStatus as keyof typeof stats.payment]++;
    if (t.approvalStatus in stats.approval) stats.approval[t.approvalStatus as keyof typeof stats.approval]++;
  });

  console.log(`📂 Categories: Students: ${stats.categories.student} | IT Pros: ${stats.categories.professional} | Startups: ${stats.categories.startup}`);
  console.log(`💰 Payment:    Pending: ${stats.payment.pending} | Paid: ${stats.payment.paid} | Failed: ${stats.payment.failed}`);
  console.log(`⚖️ Approval:   Pending: ${stats.approval.pending} | Approved: ${stats.approval.approved} | Rejected: ${stats.approval.rejected}`);
  console.log("==================================================================");

  teams.forEach((team, index) => {
    const leaderUser = team.leader;
    console.log(`\n🔥 [TEAM #${index + 1}] ID: ${team.teamId} - "${team.teamName.toUpperCase()}"`);
    console.log(`   ├─ Category:       ${team.category.toUpperCase()}`);
    console.log(`   ├─ Project Title:  ${team.projectDetails?.title || "N/A"}`);
    console.log(`   ├─ Theme/Track:    ${team.projectDetails?.theme || "N/A"}`);
    console.log(`   ├─ Tech Stack:     ${team.projectDetails?.techStack?.join(", ") || "N/A"}`);
    console.log(`   ├─ Leader:         ${leaderUser?.name || "N/A"} (${leaderUser?.email || "N/A"}) - Tel: ${leaderUser?.mobile || "N/A"}`);
    console.log(`   ├─ Discord Joined: ${team.discordVerified ? "✅ YES (Linked)" : "❌ NO"}`);
    console.log(`   ├─ Payment Status: ${team.paymentStatus === "paid" ? "✅ PAID" : "❌ " + team.paymentStatus.toUpperCase()}`);
    console.log(`   └─ Admin Approval: ${team.approvalStatus === "approved" ? "✅ APPROVED" : team.approvalStatus === "rejected" ? "❌ REJECTED" : "⏳ PENDING"}`);

    if (team.members && team.members.length > 0) {
      console.log(`   └─ Members (${team.members.length}):`);
      team.members.forEach((m: any, mIdx: number) => {
        console.log(`      └─ [Member ${mIdx + 1}] Name: ${m.name} | Email: ${m.email} | Role: ${m.role}`);
      });
    }
  });

  console.log("\n==================================================================");
  console.log("🌌 End of registered teams report.");
  console.log("==================================================================");
}

async function tryDirectDB() {
  console.log("Method 1: Attempting direct database connection...");
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
  console.log("✅ Connected directly to MongoDB.\n");

  const teams = await Team.find()
    .populate("leader members")
    .sort({ createdAt: -1 });

  const users = await User.find().sort({ createdAt: -1 });

  printReport(teams, users);
  await mongoose.connection.close();
}

async function tryHTTP() {
  console.log("\nMethod 2: Attempting fetch from running backend server...");
  const endpoint = `${API_BASE_URL}/api/public/debug-teams`;
  console.log(`📡 Fetching from: ${endpoint}`);

  const res = await axios.get(endpoint, { timeout: 4000 });
  if (res.data && res.data.success) {
    console.log("✅ Successfully retrieved teams via Backend HTTP service.\n");
    printReport(res.data.teams, res.data.users);
  } else {
    throw new Error("API returned success: false");
  }
}

async function run() {
  console.log("==================================================================");
  console.log("🌌 INCUXAI AI GAMING HACKATHON - REGISTERED TEAMS VIEWER");
  console.log("==================================================================");

  try {
    await tryDirectDB();
  } catch (dbErr: any) {
    console.warn(`⚠️ Direct DB connection failed: ${dbErr.message || dbErr}`);
    try {
      await tryHTTP();
    } catch (httpErr: any) {
      console.error(`❌ Fallback HTTP request failed: ${httpErr.message || httpErr}`);
      console.error("\nCould not retrieve teams. Please make sure the backend server is running via 'npm run dev:backend'");
      process.exit(1);
    }
  }
  process.exit(0);
}

run();
