require("dotenv").config();
const crypto = require("crypto");

// Convert API key to Buffer for secure comparison
const apiKeyBuffer = Buffer.from(process.env.API_KEY || "", "utf-8");

const apiKeyMiddleware = (req, res, next) => {
    try {
        const apiKey = req.get("x-api-key") || ""; // Case-insensitive
        const apiKeyInputBuffer = Buffer.from(apiKey, "utf-8");

        // Secure comparison
        if (apiKey.length === 0 || !crypto.timingSafeEqual(apiKeyBuffer, apiKeyInputBuffer)) {
            console.warn(`[SECURITY] Unauthorized API access attempt from ${req.ip}`);
            return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
        }

        next();
    } catch (err) {
        console.error(`[ERROR] API key validation failed: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = apiKeyMiddleware;
