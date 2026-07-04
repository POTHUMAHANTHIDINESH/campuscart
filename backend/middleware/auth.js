import jwt from "jsonwebtoken";

// Attaches req.userId if a valid token is present. Used on any route
// that requires the person to be logged in (create listing, checkout, etc).
export function requireAuth(req, res, next) {
  const header = req.headers.authorization; // expected format: "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}
