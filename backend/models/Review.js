import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// A student can only leave one review per product they bought — enforced
// here at the DB level in addition to the application-level check in
// reviewRoutes.js.
reviewSchema.index({ reviewer: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
