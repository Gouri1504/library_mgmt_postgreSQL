require("dotenv").config();

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"]; // Read API key from request headers
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
    next();
};

module.exports = apiKeyMiddleware;
