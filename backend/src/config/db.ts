import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);
  try {
    logger.info("Attempting to connect to MongoDB Atlas cluster...");
    // Use a short connection timeout so it fails fast if whitelisting prevents connection
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    logger.info("Successfully connected to MongoDB Atlas.");
  } catch (error) {
    logger.warn({ err: error }, "Failed to connect to MongoDB Atlas cluster. Falling back to local In-Memory MongoDB server for local development...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      logger.info(`Starting In-Memory MongoDB server at: ${mongoUri}`);
      await mongoose.connect(mongoUri);
      logger.info("Successfully connected to In-Memory MongoDB.");
    } catch (fallbackError) {
      logger.error({ err: fallbackError }, "Failed to start or connect to In-Memory MongoDB");
      throw error;
    }
  }
};

