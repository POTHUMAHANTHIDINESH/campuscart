import express from "express";
import { body, param } from "express-validator";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

const createReviewValidation = [
  body("sellerId").isMongoId().withMessage("Invalid seller id."),
  body("productId").isMongoId().withMessage("Invalid product id."),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
  body("comment").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

// POST /api/reviews — leave a review for a seller after buying from them
// Only allowed if the reviewer has a PAID order containing that exact product,
// so reviews can only be left by students who actually received the item.
router.post("/", requireAuth, createReviewValidation, handleValidation, async (req, res) => {
  try {
    const { sellerId, productId, rating, comment } = req.body;

    const purchase = await Order.findOne({
      buyer: req.userId,
      status: "paid",
      "items.product": productId,
    });

    if (!purchase) {
      return res.status(403).json({
        message: "You can only review a seller after receiving an item from them.",
      });
    }

    const existingReview = await Review.findOne({
      reviewer: req.userId,
      product: productId,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You've already reviewed this purchase." });
    }

    const review = await Review.create({
      seller: sellerId,
      reviewer: req.userId,
      product: productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to post review.", error: err.message });
  }
});

// GET /api/reviews/seller/:sellerId — all reviews for a given seller, plus average rating
router.get(
  "/seller/:sellerId",
  [param("sellerId").isMongoId().withMessage("Invalid seller id.")],
  handleValidation,
  async (req, res) => {
    try {
      const reviews = await Review.find({ seller: req.params.sellerId })
        .populate("reviewer", "name")
        .sort({ createdAt: -1 });

      const average =
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : null;

      res.json({ reviews, average, count: reviews.length });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reviews.", error: err.message });
    }
  }
);

// GET /api/reviews/eligibility/:productId — can the logged-in user review this product?
// Used by the frontend to decide whether to show the review form at all.
router.get(
  "/eligibility/:productId",
  requireAuth,
  [param("productId").isMongoId().withMessage("Invalid product id.")],
  handleValidation,
  async (req, res) => {
    try {
      const purchase = await Order.findOne({
        buyer: req.userId,
        status: "paid",
        "items.product": req.params.productId,
      });
      const alreadyReviewed = await Review.findOne({
        reviewer: req.userId,
        product: req.params.productId,
      });
      res.json({
        canReview: Boolean(purchase) && !alreadyReviewed,
        purchased: Boolean(purchase),
        alreadyReviewed: Boolean(alreadyReviewed),
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to check review eligibility.", error: err.message });
    }
  }
);

export default router;
