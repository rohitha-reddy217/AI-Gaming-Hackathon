import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});

export const createRazorpayOrder = async ({ amount, receipt }: { amount: number; receipt: string }): Promise<any> => {
  if (
    !env.RAZORPAY_KEY_ID ||
    env.RAZORPAY_KEY_ID === "rzp_test_dummykeyid" ||
    env.RAZORPAY_KEY_ID.includes("dummy")
  ) {
    return {
      id: "order_" + crypto.randomBytes(8).toString("hex"),
      amount: amount * 100,
      currency: "INR",
      receipt,
      status: "created"
    };
  }

  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt,
    payment_capture: true
  });
};

export const verifyRazorpaySignature = (payload: string, signature: string) => {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return expected === signature;
};
