/**
 * Vercel serverless entry - exports Express app.
 * Do NOT use server.ts (listen) - Vercel invokes this per request.
 */
import mongoose from "mongoose";
import app from "../app";
import { envVars } from "../app/config/env";

// Connect to MongoDB on cold start (mongoose queues operations until connected)
mongoose.connect(envVars.DB_URL!).catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

export default app;

