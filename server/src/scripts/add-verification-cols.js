import pool from "../config/db.js";

const migrate = async () => {
  try {
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;",
    );
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);",
    );
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP WITH TIME ZONE;",
    );
    console.log(
      "Migration successful: Added verification columns to users table",
    );
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    process.exit();
  }
};

migrate();
