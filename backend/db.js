require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Use Render's External Database URL if available
const connectionString = process.env.DB_URL || null;

const pool = new Pool(
    connectionString
        ? { connectionString, ssl: { rejectUnauthorized: false } } // Use DB_URL if available
        : {
              user: process.env.DB_USER || "default_user",
              host: process.env.DB_HOST || "localhost",
              database: process.env.DB_NAME || "default_db",
              password: process.env.DB_PASS || "password",
              port: process.env.DB_PORT || 5432,
              ssl: isProduction ? { rejectUnauthorized: false } : false, // Enable SSL in production
              max: 20, // Max concurrent clients
              idleTimeoutMillis: 30000, // Close idle clients after 30s
              connectionTimeoutMillis: 5000, // Wait max 5s for a connection
          }
);

// Handle connection errors
pool.on("error", (err) => {
    console.error("[DB ERROR] Unexpected error on idle client", err);
    process.exit(1); // Restart the server on critical DB errors
});

// Test connection
(async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log(`[DB CONNECTED] at ${res.rows[0].now}`);
    } catch (err) {
        console.error("[DB CONNECTION ERROR]", err);
        process.exit(1);
    }
})();

module.exports = pool;
