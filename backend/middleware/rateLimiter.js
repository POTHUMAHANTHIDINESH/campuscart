import rateLimit from "express-rate-limit";

// Applied to /api/auth routes. Allows 20 attempts per 15 minutes per IP —
// generous enough for real users retrying a typo'd password, but enough
// to slow down automated brute-force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});
