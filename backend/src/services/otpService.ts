import { EmailOtp } from "../models/EmailOtp";
import { otpTemplate } from "./emailTemplates";
import { sendEmail } from "./emailService";

export const generateOtp = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await EmailOtp.deleteMany({ email });
  await EmailOtp.create({ email, code, expiresAt });

  console.log("\n========================================");
  console.log(`🔑 [DEVELOPMENT OTP] Email: ${email}`);
  console.log(`👉 OTP CODE: ${code}`);
  console.log("========================================\n");

  await sendEmail({
    to: email,
    subject: "Your IncuXai OTP",
    html: otpTemplate(code)
  });

  return { email, expiresAt };
};

export const verifyOtp = async (email: string, code: string) => {
  const record = await EmailOtp.findOne({ email, code });
  if (!record) {
    return false;
  }
  const valid = record.expiresAt.getTime() > Date.now();
  if (valid) {
    await EmailOtp.deleteMany({ email });
  }
  return valid;
};
