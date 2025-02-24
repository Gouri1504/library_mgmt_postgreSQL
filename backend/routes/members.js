const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM member");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get member by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM member WHERE mem_id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new member
router.post("/", async (req, res) => {
    try {
        const { mem_name, mem_phone, mem_email } = req.body;
        const result = await pool.query(
            "INSERT INTO member (mem_name, mem_phone, mem_email) VALUES ($1, $2, $3) RETURNING *",
            [mem_name, mem_phone, mem_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update member
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { mem_name, mem_phone, mem_email } = req.body;
        const result = await pool.query(
            "UPDATE member SET mem_name=$1, mem_phone=$2, mem_email=$3 WHERE mem_id=$4 RETURNING *",
            [mem_name, mem_phone, mem_email, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete member
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM member WHERE mem_id = $1", [id]);
        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
