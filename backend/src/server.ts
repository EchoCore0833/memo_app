
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/memo_app";

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Memo App API is running! (Development Mode)");
});

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

void startServer();
