require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

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
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected! Current time:", res.rows[0].now);
    }
});

// Apply API Key Middleware globally (optional)
app.use(apiKeyMiddleware);

// Routes
app.use("/book", bookRoutes);
app.use("/member", memberRoutes);
app.use("/issuance", issuanceRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
