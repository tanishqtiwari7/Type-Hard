import pool from "../config/db.js";

const migrate = async () => {
  try {
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_otp VARCHAR(6);",
    );
    await pool.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP WITH TIME ZONE;",
    );
    console.log(
      "Migration successful: Added reset_password_otp and reset_password_expires to users",
    );
  } catch (err) {
    console.error("Migration failed", err);
  } finally {
    process.exit();
  }
};

migrate();
