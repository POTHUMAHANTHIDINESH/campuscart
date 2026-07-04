import express from "express";
import { body, param, query } from "express-validator";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

const CATEGORIES = ["Books", "Notes", "Electronics", "Hostel Items", "Cycles", "Gym", "Other"];

const createProductValidation = [
  body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 150 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category."),
  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

const idParamValidation = [param("id").isMongoId().withMessage("Invalid product id.")];

// GET /api/products?search=...&category=...
// Public — anyone can browse, no login required
router.get(
  "/",
  [
    query("search").optional().trim().isLength({ max: 100 }),
    query("category").optional().trim().isIn([...CATEGORIES, "All"]).withMessage("Invalid category."),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { search, category } = req.query;
      const filter = { status: "available" };

      if (category && category !== "All") {
        filter.category = category;
      }
      if (search) {
        filter.$text = { $search: search };
      }

      const products = await Product.find(filter)
        .populate("seller", "name email")
        .sort({ createdAt: -1 });

      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products.", error: err.message });
    }
  }
);

// GET /api/products/mine/all — listings posted by the logged-in user
// (declared before /:id so "mine" isn't swallowed by the :id param)
router.get("/mine/all", requireAuth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your listings.", error: err.message });
  }
});

// GET /api/products/:id — single product detail
router.get("/:id", idParamValidation, handleValidation, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product.", error: err.message });
  }
});

// POST /api/products — create a new listing (requires login)
router.post("/", requireAuth, createProductValidation, handleValidation, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      category,
      imageUrl,
      seller: req.userId,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create listing.", error: err.message });
  }
});

// DELETE /api/products/:id — only the seller who posted it can delete it
router.delete("/:id", requireAuth, idParamValidation, handleValidation, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }
    await product.deleteOne();
    res.json({ message: "Listing deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing.", error: err.message });
  }
});

export default router;
