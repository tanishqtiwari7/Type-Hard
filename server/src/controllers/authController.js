import pool from "../config/db.js";

export const checkDailyLimit = async (req, res) => {
  const clientIp = req.ip;
  const today = new Date().toISOString().split("T")[0];

  try {
    // Check if user is logged in (mock check for now)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // User is logged in, no limit
      return res.json({ allowed: true, reason: "authenticated" });
    }

    // Check DB for IP today
    const result = await pool.query(
      "SELECT test_count FROM daily_tracking WHERE ip_address = $1 AND last_test_at::date = $2",
      [clientIp, today]
    );

    if (result.rows.length > 0 && result.rows[0].test_count >= 1) {
      return res.json({ allowed: false, reason: "daily_limit_reached" });
    }

    return res.json({ allowed: true, reason: "guest_allowance", remaining: 1 });
  } catch (error) {
    console.error(error);
    // Fail open if DB error so user isn't blocked unnecessarily during partial outages
    res.json({ allowed: true, reason: "error_fallback" });
  }
};

export const mockLogin = async (req, res) => {
  // Mock login for dev/demo purposes until Google OAuth is fully configured
  const { username } = req.body;
  // In real app, verify token/password.
  // Here just return a success payload.
  res.json({
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: 1,
      username: username || "GuestUser",
      email: "guest@example.com",
      avatar: "https://via.placeholder.com/150",
    },
  });
};
