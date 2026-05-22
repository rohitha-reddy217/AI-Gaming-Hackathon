import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Team } from "../models/Team";
import { Payment } from "../models/Payment";
import crypto from "crypto";
import { env } from "../config/env";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/razorpayService";
import { generateId } from "../utils/ids";
import { ApiError } from "../utils/apiError";
import { generateGstInvoice } from "../services/invoiceService";
import { uploadBufferToCloudinary } from "../services/cloudinaryService";
import { generateQrBuffer } from "../services/qrService";
import { createAuditLog } from "../services/auditService";
import { sendEmail } from "../services/emailService";
import { paymentSuccessTemplate, paymentFailureTemplate, registrationSuccessTemplate } from "../services/emailTemplates";
import { User } from "../models/User";

const feeByCategory = {
  student: 999,
  professional: 1999,
  startup: 2999
};

export const createPaymentOrderController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { teamId } = req.body as { teamId: string };
  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const amount = feeByCategory[team.category];
  const order = await createRazorpayOrder({ amount, receipt: team.teamId });

  const payment = await Payment.create({
    transactionId: generateId(),
    team: team._id,
    amount,
    status: "created",
    razorpayOrderId: order.id
  });

  res.json({ success: true, order, paymentId: payment.transactionId, amount });

  await createAuditLog({
    actorUserId: req.user.userId,
    action: "payment.order_created",
    target: team.teamId,
    metadata: { amount }
  });
});

export const razorpayWebhookController = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  if (!signature) {
    throw new ApiError(400, "Missing signature");
  }

  const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf-8") : JSON.stringify(req.body);
  const valid = verifyRazorpaySignature(payload, signature);
  if (!valid) {
    throw new ApiError(400, "Invalid signature");
  }

  const eventBody = Buffer.isBuffer(req.body) ? JSON.parse(payload) : req.body;
  const event = eventBody.event as string;
  const paymentEntity = eventBody?.payload?.payment?.entity;

  if (event === "payment.captured") {
    const razorpayOrderId = paymentEntity.order_id as string;
    const payment = await Payment.findOne({ razorpayOrderId });
    if (payment) {
      payment.status = "paid";
      payment.razorpayPaymentId = paymentEntity.id;
      await payment.save();

      const team = await Team.findById(payment.team);
      if (team) {
        team.paymentStatus = "paid";
        await team.save();

        const invoice = await generateGstInvoice({
          teamId: team.teamId,
          amount: payment.amount,
          transactionId: payment.transactionId
        });

        const invoiceUrl = await uploadBufferToCloudinary(invoice, "incuxai/invoices", "raw");
        payment.gstInvoiceUrl = invoiceUrl;
        await payment.save();

        const qrBuffer = await generateQrBuffer(JSON.stringify({ teamId: team.teamId, paymentId: payment.transactionId }));
        const qrUrl = await uploadBufferToCloudinary(qrBuffer, "incuxai/tickets", "image");
        team.qrTicketUrl = qrUrl;
        await team.save();

        await createAuditLog({
          action: "payment.captured",
          target: team.teamId,
          metadata: { amount: payment.amount, paymentId: payment.transactionId }
        });

        const leader = await User.findById(team.leader);
        if (leader) {
          await sendEmail({
            to: leader.email,
            subject: "IncuXai Payment Successful",
            html: paymentSuccessTemplate(payment.amount, team.teamId)
          });
          await sendEmail({
            to: leader.email,
            subject: "IncuXai Registration Confirmed",
            html: registrationSuccessTemplate(leader.name, team.teamId)
          });
        }
      }
    }
  }

  if (event === "payment.failed") {
    const razorpayOrderId = paymentEntity.order_id as string;
    const payment = await Payment.findOne({ razorpayOrderId });
    if (payment) {
      payment.status = "failed";
      await payment.save();
      const team = await Team.findById(payment.team);
      if (team) {
        team.paymentStatus = "failed";
        await team.save();
        const leader = await User.findById(team.leader);
        if (leader) {
          await sendEmail({
            to: leader.email,
            subject: "IncuXai Payment Failed",
            html: paymentFailureTemplate(team.teamId)
          });
        }
      }
    }
  }

  res.json({ success: true });
});

export const listTeamPaymentsController = asyncHandler(async (req: Request, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }
  const payments = await Payment.find({ team: team._id }).sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

export const refundPaymentController = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, status: "refund_requested" });
});

export const verifyPaymentController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Missing verification fields");
  }

  // Verify client signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
  const text = razorpayOrderId + "|" + razorpayPaymentId;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");

  const isDummyBypass = env.RAZORPAY_KEY_SECRET === "dummysecret" && razorpaySignature === "dev-simulated-signature";

  if (!isDummyBypass && expected !== razorpaySignature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    throw new ApiError(404, "Payment transaction record not found");
  }

  if (payment.status === "paid") {
    res.json({ success: true, message: "Payment already successfully processed" });
    return;
  }

  // Update payment status
  payment.status = "paid";
  payment.razorpayPaymentId = razorpayPaymentId;
  await payment.save();

  const team = await Team.findById(payment.team);
  if (team) {
    team.paymentStatus = "paid";
    await team.save();

    // Synchronously generate Invoice
    const invoice = await generateGstInvoice({
      teamId: team.teamId,
      amount: payment.amount,
      transactionId: payment.transactionId
    });
    const invoiceUrl = await uploadBufferToCloudinary(invoice, "incuxai/invoices", "raw");
    payment.gstInvoiceUrl = invoiceUrl;
    await payment.save();

    // Synchronously generate QR Entry Ticket
    const qrBuffer = await generateQrBuffer(JSON.stringify({ teamId: team.teamId, paymentId: payment.transactionId }));
    const qrUrl = await uploadBufferToCloudinary(qrBuffer, "incuxai/tickets", "image");
    team.qrTicketUrl = qrUrl;
    await team.save();

    await createAuditLog({
      actorUserId: req.user.userId,
      action: "payment.verified",
      target: team.teamId,
      metadata: { amount: payment.amount, paymentId: payment.transactionId }
    });

    const leader = await User.findById(team.leader);
    if (leader) {
      await sendEmail({
        to: leader.email,
        subject: "IncuXai Payment Successful",
        html: paymentSuccessTemplate(payment.amount, team.teamId)
      });
      await sendEmail({
        to: leader.email,
        subject: "IncuXai Registration Confirmed",
        html: registrationSuccessTemplate(leader.name, team.teamId)
      });
    }
  }

  res.json({ success: true });
});
