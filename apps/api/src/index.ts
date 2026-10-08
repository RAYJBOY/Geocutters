import express from "express";
import { authRoute } from "./routes/auth.route";
import { hairdresserRoute } from "./routes/hairdresser.route";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/hairdresser", hairdresserRoute);

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