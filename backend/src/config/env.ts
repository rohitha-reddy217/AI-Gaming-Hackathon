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

const cleanedEnv = Object.fromEntries(
  Object.entries(process.env).map(([key, value]) => [
    key,
    value === "" || (typeof value === "string" && value.trim() === "") ? undefined : value
  ])
);

const ENV_METADATA: Record<string, { description: string; example: string }> = {
  MONGO_URI: {
    description: "MongoDB connection string",
    example: "mongodb+srv://user:pass@cluster.mongodb.net/incuxai"
  },
  JWT_SECRET: {
    description: "Secret for JWT tokens",
    example: "Any random string (32+ chars)"
  },
  NEXTAUTH_SECRET: {
    description: "NextAuth secret",
    example: "Any random string (32+ chars)"
  },
  COOKIE_SECRET: {
    description: "Cookie encryption secret",
    example: "Any random string (32+ chars)"
  },
  API_BASE_URL: {
    description: "Your backend URL",
    example: "https://incuxai-backend-production.up.railway.app"
  },
  WEB_BASE_URL: {
    description: "Your frontend URL",
    example: "https://your-frontend-domain.com"
  },
  RAZORPAY_KEY_ID: {
    description: "Razorpay payment key ID",
    example: "From Razorpay dashboard"
  },
  RAZORPAY_KEY_SECRET: {
    description: "Razorpay secret key",
    example: "From Razorpay dashboard"
  },
  RAZORPAY_WEBHOOK_SECRET: {
    description: "Razorpay webhook secret",
    example: "From Razorpay dashboard"
  },
  RESEND_API_KEY: {
    description: "Resend email API key",
    example: "From Resend dashboard"
  },
  RESEND_FROM_EMAIL: {
    description: "Email sender address",
    example: "noreply@yourdomain.com"
  },
  DISCORD_CLIENT_ID: {
    description: "Discord OAuth app ID",
    example: "From Discord Developer Portal"
  },
  DISCORD_CLIENT_SECRET: {
    description: "Discord OAuth secret",
    example: "From Discord Developer Portal"
  },
  DISCORD_REDIRECT_URI: {
    description: "Discord OAuth redirect URI",
    example: "https://your-frontend/auth/discord/callback"
  },
  DISCORD_GUILD_ID: {
    description: "Your Discord server ID",
    example: "Your server's ID"
  },
  DISCORD_BOT_TOKEN: {
    description: "Discord bot token",
    example: "From Discord Developer Portal"
  },
  DISCORD_ANNOUNCEMENTS_CHANNEL_ID: {
    description: "Channel ID for announcements",
    example: "Your channel's ID"
  },
  DISCORD_MEMBER_ROLE_STUDENT: {
    description: "Student role ID",
    example: "Your role's ID"
  },
  DISCORD_MEMBER_ROLE_PRO: {
    description: "Pro member role ID",
    example: "Your role's ID"
  },
  DISCORD_MEMBER_ROLE_STARTUP: {
    description: "Startup role ID",
    example: "Your role's ID"
  },
  OPENAI_API_KEY: {
    description: "OpenAI API key",
    example: "From OpenAI dashboard"
  },
  OPENAI_MODEL: {
    description: "OpenAI model to use",
    example: "gpt-4o-mini"
  },
  CLOUDINARY_CLOUD_NAME: {
    description: "Cloudinary cloud name",
    example: "From Cloudinary dashboard"
  },
  CLOUDINARY_API_KEY: {
    description: "Cloudinary API key",
    example: "From Cloudinary dashboard"
  },
  CLOUDINARY_API_SECRET: {
    description: "Cloudinary API secret",
    example: "From Cloudinary dashboard"
  }
};

const parsed = envSchema.safeParse(cleanedEnv);

if (!parsed.success) {
  /* eslint-disable no-console */
  console.error("\n" + "=".repeat(80));
  console.error("❌ INVALID OR MISSING ENVIRONMENT CONFIGURATION");
  console.error("=".repeat(80));
  console.error("The following environment variables are missing, empty, or incorrectly formatted.");
  console.error("Please update them in your Railway dashboard or local .env file:\n");

  const errors = parsed.error.flatten().fieldErrors;
  
  Object.entries(errors).forEach(([field, messages]) => {
    const metadata = ENV_METADATA[field];
    const desc = metadata ? metadata.description : "No description available";
    const example = metadata ? metadata.example : "N/A";
    const issue = messages ? messages.join(", ") : "Invalid value";

    console.error(`👉 Variable:   \x1b[36m${field}\x1b[0m`);
    console.error(`   Issue:      \x1b[31m${issue}\x1b[0m`);
    console.error(`   What it is: ${desc}`);
    console.error(`   Example:    \x1b[32m${example}\x1b[0m`);
    console.error("-".repeat(80));
  });

  console.error("Please configure the required environment variables above and restart the server.");
  console.error("=".repeat(80) + "\n");
  /* eslint-enable no-console */
  process.exit(1);
}

export const env = parsed.data;
