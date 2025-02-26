require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { logMessage } = require("./logger.js"); // Import logMessage function

const app = express();
const port = process.env.PORT || 3000;

const bookRoutes = require("./routes/books");
const memberRoutes = require("./routes/members");
const issuanceRoutes = require("./routes/issuance");
const apiKeyMiddleware = require("./middleware/auth");

app.use(express.json());
app.use(cors());

// Test Database Connection
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        logMessage("error", `Database connection error: ${err.message}`, "DBConnection");
    } else {
        logMessage("info", `Database connected! Current time: ${res.rows[0].now}`, "DBConnection");
    }
});

function sampleFunction() {
    logMessage('info', 'testing redeploy', 'sampleFunction');
}

sampleFunction();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is working fine!" });
});

// Apply API Key Middleware globally (optional)
app.use(apiKeyMiddleware);

// Middleware to log incoming requests
app.use((req, res, next) => {
    logMessage("info", `Incoming request: [${req.method}] ${req.url}`, "RequestLogger");
    next();
});

// Routes
app.use("/book", bookRoutes);
app.use("/member", memberRoutes);
app.use("/issuance", issuanceRoutes);

const server = app.listen(port, () => {
    logMessage("info", `Server running on http://localhost:${port}`, "ServerStart");
});

// Graceful Shutdown Handling
process.on("SIGINT", () => {
    logMessage("warn", "Server shutting down due to SIGINT", "Shutdown");
    server.close(() => {
        logMessage("info", "Server shutdown complete", "Shutdown");
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    logMessage("warn", "Server shutting down due to SIGTERM", "Shutdown");
    server.close(() => {
        logMessage("info", "Server shutdown complete", "Shutdown");
        process.exit(0);
    });
});