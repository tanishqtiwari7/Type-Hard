import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "../models/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Running schema.sql...");
    await pool.query(schemaSql);
    console.log("Database initialized successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
};

initDb();
