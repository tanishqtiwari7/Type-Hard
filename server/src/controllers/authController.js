import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );
};

// Register User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const picture = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`;

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash, picture) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, passwordHash, picture]
    );

    const user = newUser.rows[0];
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
      [googleId, email]
    );

    let user;

    if (userCheck.rows.length > 0) {
      user = userCheck.rows[0];
      if (!user.google_id) {
        await pool.query(
          "UPDATE users SET google_id = $1, picture = $2 WHERE id = $3",
          [googleId, picture, user.id]
        );
      }
    } else {
      let username =
        name.replace(/\s+/g, "").toLowerCase() +
        Math.floor(Math.random() * 10000);
      const newUser = await pool.query(
        "INSERT INTO users (google_id, email, username, picture, role) VALUES ($1, $2, $3, $4, 'user') RETURNING *",
        [googleId, email, username, picture]
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
      [req.user.id]
    );
    res.json({ success: true, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
