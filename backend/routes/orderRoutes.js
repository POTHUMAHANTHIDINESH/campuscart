import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { body, param } from "express-validator";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// True only when the env vars are still the placeholder demo values from
// .env.example — used to run a simulated "local" checkout that never
// silently marks an order paid without an explicit confirm step.
const isDummyRazorpayConfig =
  process.env.RAZORPAY_KEY_ID === "rzp_test_dummy" ||
  process.env.RAZORPAY_KEY_SECRET === "dummy_secret" ||
  !razorpay;

const createPaymentValidation = [
  body("items").isArray({ min: 1 }).withMessage("Cart is empty."),
  body("items.*.productId").isMongoId().withMessage("Invalid product id in cart."),
  body("items.*.title").trim().notEmpty(),
  body("items.*.price").isFloat({ min: 0 }),
];

// POST /api/orders/create-payment
// Step 1 of checkout: create an order for the cart total.
// IMPORTANT: the order always starts as "pending" here — it is only ever
// marked "paid" by a later, explicit confirmation step (either Razorpay's
// verified signature, or the local-simulation confirm route below). It is
// never marked paid just because this route ran.
router.post("/create-payment", requireAuth, createPaymentValidation, handleValidation, async (req, res) => {
  try {
    const { items } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (isDummyRazorpayConfig) {
      const order = await Order.create({
        buyer: req.userId,
        items: items.map((i) => ({ product: i.productId, title: i.title, price: i.price })),
        totalAmount,
        razorpayOrderId: `local_${Date.now()}`,
        status: "pending",
      });

      return res.json({
        orderId: order._id,
        razorpayOrderId: order.razorpayOrderId,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        keyId: null,
        localMode: true, // tells the frontend to skip the real Razorpay popup
      });
    }

    // Razorpay expects the amount in paise (smallest currency unit), so multiply by 100
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      buyer: req.userId,
      items: items.map((i) => ({ product: i.productId, title: i.title, price: i.price })),
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to expose, it's the public key
      localMode: false,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to start payment.", error: err.message });
  }
});

// POST /api/orders/verify-payment
// Step 2 of checkout (real Razorpay flow only): after Razorpay's popup
// completes successfully, verify the signature to confirm the payment is
// genuine (not spoofed by someone editing frontend JS).
router.post(
  "/verify-payment",
  requireAuth,
  [
    body("orderId").isMongoId(),
    body("razorpay_order_id").notEmpty(),
    body("razorpay_payment_id").notEmpty(),
    body("razorpay_signature").notEmpty(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed." });
      }

      const order = await Order.findOne({ _id: orderId, buyer: req.userId });
      if (!order) return res.status(404).json({ message: "Order not found." });

      order.status = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Mark each purchased product as sold
      const productIds = order.items.map((i) => i.product);
      await Product.updateMany({ _id: { $in: productIds } }, { status: "sold" });

      res.json({ message: "Payment verified successfully.", order });
    } catch (err) {
      res.status(500).json({ message: "Payment verification error.", error: err.message });
    }
  }
);

// POST /api/orders/complete-local-payment
// Only used in local-simulation mode (no real Razorpay keys configured).
// Requires an explicit call from the frontend after the person confirms —
// never triggered automatically, so it can't silently mark an order paid.
router.post(
  "/complete-local-payment",
  requireAuth,
  [body("orderId").isMongoId()],
  handleValidation,
  async (req, res) => {
    try {
      if (!isDummyRazorpayConfig) {
        return res.status(400).json({ message: "Local payment simulation is disabled — real Razorpay keys are configured." });
      }

      const order = await Order.findOne({ _id: req.body.orderId, buyer: req.userId });
      if (!order) return res.status(404).json({ message: "Order not found." });
      if (!order.razorpayOrderId.startsWith("local_")) {
        return res.status(400).json({ message: "This order was not created in local simulation mode." });
      }
      if (order.status === "paid") {
        return res.status(400).json({ message: "Order is already paid." });
      }

      order.status = "paid";
      await order.save();

      const productIds = order.items.map((i) => i.product);
      await Product.updateMany({ _id: { $in: productIds } }, { status: "sold" });

      res.json({ message: "Local payment simulated successfully.", order });
    } catch (err) {
      res.status(500).json({ message: "Failed to complete local payment.", error: err.message });
    }
  }
);

// GET /api/orders/mine — order history for the logged-in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
  }
});

export default router;