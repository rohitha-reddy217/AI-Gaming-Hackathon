import { Resend } from "resend";
import nodemailer from "nodemailer";
import axios from "axios";
import { env } from "../config/env";
import { logger } from "../config/logger";

const resend = env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_dummy"
  ? new Resend(env.RESEND_API_KEY)
  : null;

// Initialize Nodemailer SMTP transporter if SMTP_USER and SMTP_PASS are configured
const smtpTransporter = env.SMTP_USER && env.SMTP_PASS
  ? nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465, // true for port 465, false for 587 (STARTTLS)
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
  : null;

export const sendEmail = async ({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  // 1. Try sending via Brevo HTTP API if BREVO_API_KEY is configured
  if (env.BREVO_API_KEY) {
    try {
      const fromEmail = env.SMTP_FROM || env.SMTP_USER || "dpkreddy2005@gmail.com";
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "IncuXai", email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html
        },
        {
          headers: {
            "accept": "application/json",
            "api-key": env.BREVO_API_KEY,
            "content-type": "application/json"
          }
        }
      );
      logger.info(`[Brevo API] Email successfully sent to: ${to}`);
      return;
    } catch (error: any) {
      logger.error({ err: error?.response?.data || error }, `[Brevo API] Failed to send email to ${to}`);
      if (process.env.NODE_ENV === "production" && !resend && !smtpTransporter) {
        throw error;
      }
    }
  }

  // 2. Try sending via Nodemailer SMTP if configured
  if (smtpTransporter) {
    try {
      const fromEmail = env.SMTP_FROM || env.SMTP_USER;
      await smtpTransporter.sendMail({
        from: `"IncuXai" <${fromEmail}>`,
        to,
        subject,
        html
      });
      logger.info(`[SMTP] Email successfully sent to: ${to}`);
      return;
    } catch (error) {
      logger.error({ err: error }, `[SMTP] Failed to send email to ${to}`);
      // If SMTP fails, we can fall back to Resend if it's configured
      if (!resend) {
        if (process.env.NODE_ENV === "production") throw error;
        return;
      }
    }
  }

  // 2. Otherwise use Resend
  if (!resend) {
    logger.warn(`[EMAIL BYPASSED] No Resend or SMTP configured. Email to: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject,
      html
    });
    logger.info(`[Resend] Email successfully sent to: ${to}`);
  } catch (error) {
    logger.error({ err: error }, `[Resend] Failed to send email to ${to}`);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};
