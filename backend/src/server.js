
import express from "express";
import cors from "cors";
import pool from "./db.js";
import memoRoutes from "./routes/memoRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
app.use("/api/memos", memoRoutes);

app.get("/", (req, res) => {
  res.send("Memo App API is running! (JavaScript + MySQL)");
});

async function startServer() {
  try {
    // MySQL接続確認
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log("MySQL connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
}

startServer();
