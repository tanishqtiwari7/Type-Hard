import express from "express";
import {
  googleAuth,
  getMe,
  register,
  login,
} from "../controllers/authController.js";
import { saveResult, getLeaderboard } from "../controllers/resultController.js";
import {
  getUserProfile,
  getUserHistory,
} from "../controllers/userController.js";
import {
  submitQuote,
  getPendingQuotes,
  voteQuote,
  getActiveQuotes,
} from "../controllers/quoteController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
// ... (verifyToken logic is below) ...

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
      (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      }
    );
  } else {
    req.user = null;
    next();
  }
};

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/google", googleAuth);
router.get("/auth/me", verifyToken, getMe);
router.post("/results", verifyToken, saveResult);
router.get("/leaderboard", getLeaderboard);

// User Profile Routes
router.get("/users/:username", getUserProfile);
router.get("/users/:username/history", getUserHistory);

// Quote Routes
router.post("/quotes/submit", verifyToken, submitQuote);
router.get("/quotes/pending", getPendingQuotes);
router.post("/quotes/:id/vote", verifyToken, voteQuote);
router.get("/quotes/library", getActiveQuotes);

export default router;
