import mongoose from "mongoose";
import { mkdir } from "node:fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export async function connectDB() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
      return;
    }

    const mongoDownloadDir = process.env.MONGOMS_DOWNLOAD_DIR;
    if (mongoDownloadDir) {
      await mkdir(mongoDownloadDir, { recursive: true });
    }

    mongoServer = await MongoMemoryServer.create({
      binary: { version: "7.0.14", downloadDir: mongoDownloadDir },
      instance: { dbName: "campuscart" },
    });
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected to in-memory server");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
