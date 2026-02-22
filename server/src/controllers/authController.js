import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" },
  );
};

// Register User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );

    if (userCheck.rows.length > 0) {
      if (userCheck.rows[0].verified === true) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      await pool.query("DELETE FROM users WHERE email = $1 OR username = $2", [
        email,
        username,
      ]);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const picture = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash, picture, verification_otp, verification_expires, verified) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *",
      [username, email, passwordHash, picture, otp, expires],
    );

    const emailSent = await sendEmail(
      email,
      "Verify Your Email - Type Hard",
      `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
         <h2>Welcome to Type Hard!</h2>
         <p>Please use the following code to verify your account:</p>
         <h1 style="color: #FFD700; background: #333; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
         <p>This code expires in 10 minutes.</p>
       </div>`,
    );

    if (emailSent) {
      return res.json({
        success: true,
        message: "Verification code sent to email.",
      });
    } else {
      await pool.query("DELETE FROM users WHERE email = $1", [email]);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND verification_otp = $2 AND verification_expires > NOW() AND verified = false",
      [email, otp],
    );

    if (userRes.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code." });
    }

    const user = userRes.rows[0];

    await pool.query(
      "UPDATE users SET verified = true, verification_otp = NULL, verification_expires = NULL WHERE id = $1",
      [user.id],
    );

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
      message: "Account verified successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = userCheck.rows[0];

    // If user has no password (google auth only), block or handle
    if (!user.password_hash) {
      return res
        .status(400)
        .json({ success: false, message: "Please log in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const googleAuth = async (req, res) => {
  const { email, name, googleId, picture } = req.body;

  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE google_id = $1 OR email = $2",
      [googleId, email],
    );

    let user;

    if (userCheck.rows.length > 0) {
      user = userCheck.rows[0];
      if (!user.google_id) {
        await pool.query(
          "UPDATE users SET google_id = $1, picture = $2 WHERE id = $3",
          [googleId, picture, user.id],
        );
      }
    } else {
      let username =
        name.replace(/\s+/g, "").toLowerCase() +
        Math.floor(Math.random() * 10000);
      const newUser = await pool.query(
        "INSERT INTO users (google_id, email, username, picture, role) VALUES ($1, $2, $3, $4, 'user') RETURNING *",
        [googleId, email, username, picture],
      );
      user = newUser.rows[0];
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const user = await pool.query(
      "SELECT id, username, email, picture, role FROM users WHERE id = $1",
      [req.user.id],
    );
    res.json({ success: true, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find an account with that email address.",
      });
    }

    const user = userRes.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      "UPDATE users SET reset_password_otp = $1, reset_password_expires = $2 WHERE id = $3",
      [otp, expires, user.id],
    );

    const emailSent = await sendEmail(
      email,
      "Password Reset Code",
      `<p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
    );

    if (emailSent) {
      res.json({ success: true, message: "Code sent to email." });
    } else {
      res.status(500).json({
        success: false,
        message:
          "Error sending email. Please check if the email address is valid.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND reset_password_otp = $2 AND reset_password_expires > NOW()",
      [email, otp],
    );

    if (userRes.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code." });
    }

    const user = userRes.rows[0];
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      "UPDATE users SET password_hash = $1, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = $2",
      [passwordHash, user.id],
    );

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
