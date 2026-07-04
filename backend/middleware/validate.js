import { validationResult } from "express-validator";

// Run after any express-validator check(...) middlewares on a route.
// Collects validation errors and responds with 400 before the route's
// main handler runs, so handlers never see malformed input.
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}
