import cron from "node-cron";
import pool from "../config/db.js";

export function initCronJobs() {
  cron.schedule("0 0 * * 0", async () => {
    console.log("Opening quote submissions...");
  });

  cron.schedule("0 17 * * 1", async () => {
    console.log("Publishing weekly quote winner...");
    try {
      const result = await pool.query("SELECT * FROM quote_submissions WHERE status = 'pending' ORDER BY votes DESC LIMIT 1");
      if (result.rows.length > 0) {
        const winner = result.rows[0];
        const isClean = !["bad", "ugly"].some(word => winner.content.includes(word)); // Placeholder
        
        if (isClean) {
            await pool.query("UPDATE quote_submissions SET status = 'winner' WHERE id = $1", [winner.id]);
            await pool.query("INSERT INTO quotes (content, author, source) VALUES ($1, $2, 'community_winner')", [winner.content, 'Community']);
        } else {
            await pool.query("UPDATE quote_submissions SET status = 'rejected' WHERE id = $1", [winner.id]);
        }
      }
    } catch (err) {
      console.error("Cron Job Error:", err);
    }
  });
}
