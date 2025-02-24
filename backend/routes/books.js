const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM book");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get book by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM book WHERE book_id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a book
router.post("/", async (req, res) => {
    try {
        const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
        const result = await pool.query(
            "INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a book
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
        const result = await pool.query(
            "UPDATE book SET book_name=$1, book_cat_id=$2, book_collection_id=$3, book_launch_date=$4, book_publisher=$5 WHERE book_id=$6 RETURNING *",
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a book
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM book WHERE book_id = $1", [id]);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
