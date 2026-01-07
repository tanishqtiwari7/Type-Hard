import pool from "../config/db.js";

export const saveResult = async (req, res) => {
  const { wpm, accuracy, raw_wpm, test_type, test_mode } = req.body;
  const userId = req.user ? req.user.id : null;

  // Guest logic: Limit 1 per day handled by middleware or client check usually
  // But for now, we just save if user is logged in, or maybe return stats without saving if guest

  if (!userId) {
    // For guest, we actually don't save to DB based on requirements?
    // 'User can take a type test without log in only one time a day' implies we might track ip
    // For this implementation, we will just return success for guests but not persist for leaderboard
    return res.json({
      success: true,
      message: "Guest result processed (not saved)",
    });
  }

  try {
    const newResult = await pool.query(
      "INSERT INTO results (user_id, wpm, accuracy, raw_wpm, test_type, test_mode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, wpm, accuracy, raw_wpm, test_type, test_mode]
    );
    res.json({ success: true, result: newResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving result" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, type = "60s" } = req.query;
    const leaderboard = await pool.query(
      "SELECT u.username, u.picture, r.wpm, r.accuracy, r.created_at FROM results r JOIN users u ON r.user_id = u.id WHERE r.test_type = $1 ORDER BY r.wpm DESC LIMIT $2",
      [type, limit]
    );
    res.json({ success: true, leaderboard: leaderboard.rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching leaderboard" });
  }
};

export const getUserStats = async (req, res) => {
  // Implementation for user specific stats
  res.json({ success: true, message: "Stats endpoint" });
};
