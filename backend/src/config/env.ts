import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";
const requiredString = (fallback: string) => (isTest ? z.string().default(fallback) : z.string().min(1));
const requiredUrl = (fallback: string) => (isTest ? z.string().default(fallback) : z.string().url());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  API_BASE_URL: requiredUrl("http://localhost:4000"),
  WEB_BASE_URL: requiredUrl("http://localhost:3000"),
  MONGO_URI: requiredString("mongodb://localhost:27017/incuxai"),
  JWT_SECRET: requiredString("test-jwt-secret-123456"),
  NEXTAUTH_SECRET: requiredString("test-nextauth-secret-123456"),
  COOKIE_SECRET: requiredString("test-cookie-secret-123456"),
  RAZORPAY_KEY_ID: requiredString("test"),
  RAZORPAY_KEY_SECRET: requiredString("test"),
  RAZORPAY_WEBHOOK_SECRET: requiredString("test"),
  RESEND_API_KEY: requiredString("test"),
  RESEND_FROM_EMAIL: requiredString("test@example.com"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  DISCORD_CLIENT_ID: requiredString("test"),
  DISCORD_CLIENT_SECRET: requiredString("test"),
  DISCORD_REDIRECT_URI: requiredUrl("http://localhost:3000"),
  DISCORD_GUILD_ID: requiredString("test"),
  DISCORD_BOT_TOKEN: requiredString("test"),
  DISCORD_ANNOUNCEMENTS_CHANNEL_ID: requiredString("test"),
  DISCORD_MEMBER_ROLE_STUDENT: requiredString("test"),
  DISCORD_MEMBER_ROLE_PRO: requiredString("test"),
  DISCORD_MEMBER_ROLE_STARTUP: requiredString("test"),
  OPENAI_API_KEY: requiredString("test"),
  OPENAI_MODEL: requiredString("gpt-4o-mini"),
  CLOUDINARY_CLOUD_NAME: requiredString("test"),
  CLOUDINARY_API_KEY: requiredString("test"),
  CLOUDINARY_API_SECRET: requiredString("test")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
