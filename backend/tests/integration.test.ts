process.env.NODE_ENV = "test";

import request from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";
import { app } from "../src/app";
import { connectDatabase } from "../src/config/db";
import { EmailOtp } from "../src/models/EmailOtp";
import { Team } from "../src/models/Team";
import { User } from "../src/models/User";
import { Payment } from "../src/models/Payment";
import { env } from "../src/config/env";
import { signJwt } from "../src/services/jwtService";

// Mock Razorpay order creation to avoid real network requests
jest.mock("../src/services/razorpayService", () => {
  const original = jest.requireActual("../src/services/razorpayService");
  return {
    ...original,
    createRazorpayOrder: jest.fn().mockImplementation(async ({ amount, receipt }) => {
      return {
        id: "order_mocked_12345",
        amount: amount * 100,
        currency: "INR",
        receipt,
        status: "created"
      };
    })
  };
});

// Mock Email service to prevent real SMTP connections/delays during testing
jest.mock("../src/services/emailService", () => ({
  sendEmail: jest.fn().mockImplementation(async () => {
    return Promise.resolve();
  })
}));

describe("IncuXai Integration Testing Suite", () => {
  let csrfToken: string;
  let csrfCookie: string;
  let userToken: string;
  let adminToken: string;
  let teamId: string;
  let teamObjectId: string;
  let razorpayOrderId: string;
  const testEmail = "john.doe@example.com";

  beforeAll(async () => {
    // Connect to database (will fallback to MongoMemoryServer if no local instance is active)
    await connectDatabase();

    // Prepare an Admin JWT token
    adminToken = signJwt({
      userId: "admin_user_999",
      role: "admin",
      email: "admin@incuxai.com",
      name: "Super Admin"
    });
  });

  afterAll(async () => {
    // Clean up database connections and drops
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  it("Step 1: Get CSRF token", async () => {
    const res = await request(app).get("/api/auth/csrf");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.csrfToken).toBeDefined();

    csrfToken = res.body.csrfToken;
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    // Safely cast or convert cookies to a string array
    const cookieArray: string[] = Array.isArray(cookies)
      ? cookies
      : typeof cookies === "string"
      ? [cookies]
      : [];
    
    // Extract csrf-token cookie
    const csrfCookieMatch = cookieArray.find((cookie: string) => cookie.startsWith("csrf-token="));
    expect(csrfCookieMatch).toBeDefined();
    csrfCookie = csrfCookieMatch!.split(";")[0];
  });

  it("Step 2: Send OTP to email", async () => {
    const res = await request(app)
      .post("/api/auth/otp/send")
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .send({ email: testEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("Step 3: Retrieve and verify OTP to register user", async () => {
    // Retrieve code from Database
    const otpRecord = await EmailOtp.findOne({ email: testEmail });
    expect(otpRecord).toBeDefined();
    expect(otpRecord?.code).toBeDefined();
    const code = otpRecord!.code;

    const res = await request(app)
      .post("/api/auth/otp/verify")
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .send({
        email: testEmail,
        code,
        name: "John Doe",
        role: "student",
        mobile: "9876543210"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe("student");
    expect(res.body.user.email).toBe(testEmail);

    userToken = res.body.token;
  });

  it("Step 4: Create a team", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        teamName: "SuperCoders",
        category: "student",
        projectDetails: {
          title: "AI NPC System",
          theme: "AI NPC Systems",
          techStack: ["Unity", "C#", "Python"],
          description: "An advanced conversational NPC powered by local LLMs."
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.team).toBeDefined();
    expect(res.body.team.teamId).toBeDefined();
    expect(res.body.team.approvalStatus).toBe("pending");
    expect(res.body.team.paymentStatus).toBe("pending");

    teamId = res.body.team.teamId;
    teamObjectId = res.body.team._id;
  });

  it("Step 5: Get current user's team", async () => {
    const res = await request(app)
      .get("/api/teams/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.team).toBeDefined();
    expect(res.body.team.teamName).toBe("SuperCoders");
    expect(res.body.team.category).toBe("student");
  });

  it("Step 6: Create payment order", async () => {
    const res = await request(app)
      .post("/api/payments/order")
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ teamId });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.id).toBe("order_mocked_12345");
    expect(res.body.amount).toBe(999); // student fee is 999

    razorpayOrderId = res.body.order.id;
  });

  it("Step 7: Synchronously verify payment signature and generate tickets", async () => {
    const razorpayPaymentId = "pay_mocked_abc123";
    // Generate valid Razorpay signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const razorpaySignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    const res = await request(app)
      .post("/api/payments/verify")
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify team state in DB updated to paid and ticket generated
    const updatedTeam = await Team.findById(teamObjectId);
    expect(updatedTeam).toBeDefined();
    expect(updatedTeam?.paymentStatus).toBe("paid");
    expect(updatedTeam?.qrTicketUrl).toBeDefined();
    expect(updatedTeam?.qrTicketUrl).toContain("data:image/png;base64,"); // Mock Cloudinary returned base64 data URI!

    // Verify payment record in DB
    const paymentRecord = await Payment.findOne({ razorpayOrderId });
    expect(paymentRecord).toBeDefined();
    expect(paymentRecord?.status).toBe("paid");
    expect(paymentRecord?.gstInvoiceUrl).toBeDefined();
    expect(paymentRecord?.gstInvoiceUrl).toContain("data:application/pdf;base64,"); // Mock Cloudinary invoice base64 data URI!
  });

  it("Step 8: Admin approves the registered team", async () => {
    const res = await request(app)
      .patch(`/api/admin/teams/${teamObjectId}/approval`)
      .set("Cookie", csrfCookie)
      .set("X-CSRF-Token", csrfToken)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.team).toBeDefined();
    expect(res.body.team.approvalStatus).toBe("approved");

    // Double check DB
    const teamDb = await Team.findById(teamObjectId);
    expect(teamDb?.approvalStatus).toBe("approved");
  });
});
