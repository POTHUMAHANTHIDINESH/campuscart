import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Books", "Notes", "Electronics", "Hostel Items", "Cycles", "Gym", "Other"],
      default: "Other",
    },
    imageUrl: { type: String, trim: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["available", "sold"], default: "available" },
  },
  { timestamps: true }
);

// Enables the $text search used in productRoutes.js (GET /api/products?search=)
productSchema.index({ title: "text", description: "text" });

export default mongoose.model("Product", productSchema);
