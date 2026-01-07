import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./services/socket.js";
import { initCronJobs } from "./services/cron.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Type-Hard API is running");
});

// Basic health check
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    return res.json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
});

// Placeholder auth route
app.post("/auth/demo-token", (req, res) => {
  // returns a demo token; replace with real OAuth/JWT flow
  res.json({ token: "demo-token" });
});

// initialize socket handlers
initSocket(io);

// initialize cron jobs
initCronJobs();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
