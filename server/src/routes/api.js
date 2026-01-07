import express from "express";
import { checkDailyLimit, mockLogin } from "../controllers/authController.js";
import { saveResult, getLeaderboard } from "../controllers/resultController.js";

const router = express.Router();

// Auth routes
router.post("/auth/login", mockLogin);
router.get("/auth/limit", checkDailyLimit);

// Result routes
router.post("/results", saveResult);
router.get("/leaderboard", getLeaderboard);

export default router;
