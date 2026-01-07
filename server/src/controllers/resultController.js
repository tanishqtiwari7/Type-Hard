import pool from "../config/db.js";

export const saveResult = async (req, res) => {
  const { wpm, accuracy, test_type, duration } = req.body;
  // TODO: extract user_id from auth middleware. For now using null (anonymous) or mock ID 1.
  const userId = req.user ? req.user.id : null;

  try {
    const result = await pool.query(
      `INSERT INTO results (user_id, wpm, accuracy, test_type, duration) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, wpm, accuracy, test_type, duration]
    );

    // Update daily tracking if anonymous
    if (!userId) {
      const clientIp = req.ip;
      await pool.query(
        `INSERT INTO daily_tracking (ip_address, test_count) 
         VALUES ($1, 1) 
         ON CONFLICT (ip_address, last_test_at::date) 
         DO UPDATE SET test_count = daily_tracking.test_count + 1, last_test_at = NOW()`,
        [clientIp]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    // Top 10 users by WPM
    const result = await pool.query(
      `SELECT u.username, r.wpm, r.accuracy, r.created_at 
       FROM results r 
       JOIN users u ON r.user_id = u.id 
       ORDER BY r.wpm DESC 
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
