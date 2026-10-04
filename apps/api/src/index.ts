import express from "express";
import { registerRoute } from "./routes/auth.route";

const app = express();
app.use(express.json());
app.use("/api", registerRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(3001, () => {
  console.log("API running on port 3001");
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});