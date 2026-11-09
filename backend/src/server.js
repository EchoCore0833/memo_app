
import express from "express";
import cors from "cors";
import pool from "./db.js";
import memoRoutes from "./routes/memoRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json({ limit: "1mb"}));
app.use("/api/memos", memoRoutes);

app.get("/", (req, res) => {
  res.send("Memo App API is running! (JavaScript + MySQL)");
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("select 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });
  }
  catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use((req, res) => {
  return res.status(404).json({
    error: "エンドポイントが見つかりません。",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "リクエストのサイズが1MB超えています。",
    });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "JSON形式が正しくありません。",
    });
  }

  return res.status(500).json({
    error: "サーバーエラーが発生しました。",
  });
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
