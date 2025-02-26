const express = require("express");
const pool = require("../db");
const { logMessage } = require("../logger"); // Import logger
const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM book");
        logMessage("info", "Fetched all books", "GetBooks");
        res.json(result.rows);
    } catch (err) {
        logMessage("error", `Failed to fetch books: ${err.message}`, "GetBooks");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get book by ID
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid book ID" });

        const result = await pool.query("SELECT * FROM book WHERE book_id = $1", [id]);
        if (result.rows.length === 0) {
            logMessage("warn", `Book with ID ${id} not found`, "GetBookById");
            return res.status(404).json({ error: "Book not found" });
        }
        logMessage("info", `Fetched book with ID ${id}`, "GetBookById");
        res.json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to fetch book: ${err.message}`, "GetBookById");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a book
router.post("/", async (req, res) => {
    try {
        const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;

        // Input validation
        if (!book_name || !book_cat_id || !book_collection_id || !book_launch_date || !book_publisher) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await pool.query(
            "INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
        );
        logMessage("info", `Created new book: ${result.rows[0].book_name}`, "CreateBook");
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to create book: ${err.message}`, "CreateBook");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a book
router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid book ID" });

        const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;

        // Input validation
        if (!book_name || !book_cat_id || !book_collection_id || !book_launch_date || !book_publisher) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await pool.query(
            "UPDATE book SET book_name=$1, book_cat_id=$2, book_collection_id=$3, book_launch_date=$4, book_publisher=$5 WHERE book_id=$6 RETURNING *",
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, id]
        );

        if (result.rows.length === 0) {
            logMessage("warn", `Book with ID ${id} not found for update`, "UpdateBook");
            return res.status(404).json({ error: "Book not found" });
        }

        logMessage("info", `Updated book with ID ${id}`, "UpdateBook");
        res.json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to update book: ${err.message}`, "UpdateBook");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a book
router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid book ID" });

        const result = await pool.query("DELETE FROM book WHERE book_id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            logMessage("warn", `Book with ID ${id} not found for deletion`, "DeleteBook");
            return res.status(404).json({ error: "Book not found" });
        }

        logMessage("info", `Deleted book with ID ${id}`, "DeleteBook");
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        logMessage("error", `Failed to delete book: ${err.message}`, "DeleteBook");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
