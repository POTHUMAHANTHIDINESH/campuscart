// Loading dotenv's config as the very first import (a side-effect import)
// ensures environment variables are set before any other module — including
// routes/orderRoutes.js, which reads process.env.RAZORPAY_KEY_ID at the
// moment it's first loaded — gets evaluated. Without this ordering, ES
// module imports are hoisted above regular code, so a later dotenv.config()
// call would run too late and those modules would see undefined env vars.
import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { seedDemoData } from "./seedData.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("CampusCart API is running.");
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDemoData();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});