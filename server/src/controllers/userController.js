import pool from "../config/db.js";

// Get User Profile by Username
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const userRes = await pool.query(
      "SELECT id, username, picture, created_at, role FROM users WHERE username = $1",
      [username]
    );

    if (userRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = userRes.rows[0];

    // Get Aggregate Stats
    const statsRes = await pool.query(
      `SELECT 
        COUNT(*) as tests_taken,
        MAX(wpm) as high_score_wpm,
        AVG(wpm)::int as avg_wpm,
        AVG(accuracy)::int as avg_acc
       FROM results 
       WHERE user_id = $1`,
      [user.id]
    );

    res.json({
      success: true,
      profile: user,
      stats: statsRes.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get User History (Recent Tests)
export const getUserHistory = async (req, res) => {
  const { username } = req.params;
  try {
    // First get ID
    const userRes = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (userRes.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const userId = userRes.rows[0].id;

    const historyRes = await pool.query(
      "SELECT wpm, accuracy, test_type, created_at FROM results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [userId]
    );

    res.json({
      success: true,
      history: historyRes.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
