import pool from "../config/db.js";

// Submit a new quote
export const submitQuote = async (req, res) => {
  const { content, source } = req.body;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const userId = req.user.id;

  try {
    // Basic validation
    if (content.length < 10)
      return res
        .status(400)
        .json({ success: false, message: "Quote too short" });

    await pool.query(
      "INSERT INTO quote_submissions (user_id, content, status) VALUES ($1, $2, 'pending')",
      [userId, content]
    );

    res.json({ success: true, message: "Quote submitted for review!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Submission failed" });
  }
};

// Get Pending Quotes (For Voting/Review)
export const getPendingQuotes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT qs.id, qs.content, qs.votes, u.username 
       FROM quote_submissions qs 
       JOIN users u ON qs.user_id = u.id 
       WHERE qs.status = 'pending' 
       ORDER BY qs.created_at DESC 
       LIMIT 20`
    );
    res.json({ success: true, quotes: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Vote on a Quote
export const voteQuote = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Must be logged in to vote" });
  }

  try {
    // Simple Increment (In production, track user_votes table to prevent double voting)
    const result = await pool.query(
      "UPDATE quote_submissions SET votes = votes + 1 WHERE id = $1 RETURNING votes",
      [id]
    );
    res.json({ success: true, votes: result.rows[0].votes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Vote failed" });
  }
};

// Get Active Quotes (For detailed library view)
export const getActiveQuotes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM quotes ORDER BY length ASC LIMIT 50"
    );
    res.json({ success: true, quotes: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch quotes" });
  }
};
