import pool from "../config/db.js";

const migrate = async () => {
  try {
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);"
    );
    console.log("Migration successful: Added password_hash to users");
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    process.exit();
  }
};

migrate();
