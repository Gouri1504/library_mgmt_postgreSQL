const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all issued books
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM issuance");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /issuance/pending?date=YYYY-MM-DD
router.get("/pending", async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date parameter is required" });

    try {
        const query = `
            SELECT 
                i.issuance_id, m.mem_name, b.book_name, i.target_return_date
            FROM issuance i
            JOIN member m ON i.issuance_member = m.mem_id
            JOIN book b ON i.book_id = b.book_id
            WHERE i.target_return_date <= $1 AND i.issuance_status = 'Pending'
        `;
        const result = await pool.query(query, [date]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Issue a book
router.post("/", async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { book_id, issuance_member, issued_by, target_return_date, issuance_status } = req.body;

        // Validate if all necessary fields are provided
        if (!book_id || !issuance_member || !issued_by || !target_return_date || !issuance_status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert the issuance record into the database
        const result = await pool.query(
            "INSERT INTO issuance (book_id, issuance_member, issued_by, target_return_date, issuance_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [book_id, issuance_member, issued_by, target_return_date, issuance_status]
        );

        // Send back the inserted record as the response
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err.message);  // Log the error for debugging
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

module.exports = router;
