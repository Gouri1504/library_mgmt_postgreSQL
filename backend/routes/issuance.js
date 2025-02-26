const express = require("express");
const pool = require("../db");
const { logMessage } = require("../logger"); // Import logger
const router = express.Router();

// Get all issued books
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM issuance");
        logMessage("info", "Fetched all issued books", "GetAllIssuedBooks");
        res.json(result.rows);
    } catch (err) {
        logMessage("error", `Failed to fetch issued books: ${err.message}`, "GetAllIssuedBooks");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get pending returns by date
router.get("/pending", async (req, res) => {
    const { date } = req.query;
    if (!date) {
        logMessage("warn", "Missing date parameter in pending issuance request", "GetPendingReturns");
        return res.status(400).json({ error: "Date parameter is required" });
    }

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

        logMessage("info", `Fetched pending returns for date: ${date}`, "GetPendingReturns");
        res.json(result.rows);
    } catch (err) {
        logMessage("error", `Failed to fetch pending returns: ${err.message}`, "GetPendingReturns");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Issue a book
router.post("/", async (req, res) => {
    try {
        // Destructure and validate request body
        let { book_id, issuance_member, issued_by, target_return_date, issuance_status } = req.body;

        book_id = parseInt(book_id);
        issuance_member = parseInt(issuance_member);
        issued_by = parseInt(issued_by);

        if (isNaN(book_id) || isNaN(issuance_member) || isNaN(issued_by) || !target_return_date || !issuance_status) {
            logMessage("warn", "Invalid input for book issuance", "IssueBook");
            return res.status(400).json({ error: "Invalid input. Please check all fields." });
        }

        // Check if the book is already issued
        const checkBookQuery = "SELECT * FROM issuance WHERE book_id = $1 AND issuance_status = 'Issued'";
        const bookCheck = await pool.query(checkBookQuery, [book_id]);

        if (bookCheck.rows.length > 0) {
            logMessage("warn", `Book ID ${book_id} is already issued`, "IssueBook");
            return res.status(400).json({ error: "This book is already issued and not returned yet." });
        }

        // Insert issuance record
        const result = await pool.query(
            "INSERT INTO issuance (book_id, issuance_member, issued_by, target_return_date, issuance_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [book_id, issuance_member, issued_by, target_return_date, issuance_status]
        );

        logMessage("info", `Issued book ID ${book_id} to member ${issuance_member}`, "IssueBook");
        res.status(201).json(result.rows[0]);

    } catch (err) {
        logMessage("error", `Failed to issue book: ${err.message}`, "IssueBook");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
