import express from "express";
import { googleAuth, getMe } from "../controllers/authController.js";
import { saveResult, getLeaderboard } from "../controllers/resultController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    req.user = null;
    next();
  }
};

router.post("/auth/google", googleAuth);
router.get("/auth/me", verifyToken, getMe);
router.post("/results", verifyToken, saveResult);
router.get("/leaderboard", getLeaderboard);

export default router;
