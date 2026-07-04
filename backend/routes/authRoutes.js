import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/User.js";
import { handleValidation } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(authLimiter);

const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("hostelBlock").optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body("enrollmentId").trim().notEmpty().withMessage("Enrollment ID is required.").isLength({ max: 50 }),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

// POST /api/auth/signup
router.post("/signup", signupValidation, handleValidation, async (req, res) => {
  try {
    const { name, email, password, hostelBlock, enrollmentId } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, hostelBlock, enrollmentId });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, enrollmentId: user.enrollmentId },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", loginValidation, handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, enrollmentId: user.enrollmentId },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

export default router;
