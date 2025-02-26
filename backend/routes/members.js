const express = require("express");
const pool = require("../db");
const { logMessage } = require("../logger"); // Import logger
const router = express.Router();

// Validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate phone number (assuming 10-digit number)
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

// Get all members
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM member");
        logMessage("info", "Fetched all members", "GetAllMembers");
        res.json(result.rows);
    } catch (err) {
        logMessage("error", `Failed to fetch members: ${err.message}`, "GetAllMembers");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get member by ID
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid member ID" });
    }

    try {
        const result = await pool.query("SELECT * FROM member WHERE mem_id = $1", [id]);

        if (result.rows.length === 0) {
            logMessage("warn", `Member ID ${id} not found`, "GetMemberByID");
            return res.status(404).json({ error: "Member not found" });
        }

        logMessage("info", `Fetched member ID ${id}`, "GetMemberByID");
        res.json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to fetch member: ${err.message}`, "GetMemberByID");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new member
router.post("/", async (req, res) => {
    let { mem_name, mem_phone, mem_email } = req.body;

    if (!mem_name || !mem_phone || !mem_email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!isValidEmail(mem_email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPhone(mem_phone)) {
        return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO member (mem_name, mem_phone, mem_email) VALUES ($1, $2, $3) RETURNING *",
            [mem_name, mem_phone, mem_email]
        );

        logMessage("info", `Created new member: ${mem_name}`, "CreateMember");
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to create member: ${err.message}`, "CreateMember");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update member
router.put("/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid member ID" });
    }

    let { mem_name, mem_phone, mem_email } = req.body;

    if (!mem_name || !mem_phone || !mem_email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!isValidEmail(mem_email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPhone(mem_phone)) {
        return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    try {
        const result = await pool.query(
            "UPDATE member SET mem_name=$1, mem_phone=$2, mem_email=$3 WHERE mem_id=$4 RETURNING *",
            [mem_name, mem_phone, mem_email, id]
        );

        if (result.rows.length === 0) {
            logMessage("warn", `Member ID ${id} not found`, "UpdateMember");
            return res.status(404).json({ error: "Member not found" });
        }

        logMessage("info", `Updated member ID ${id}`, "UpdateMember");
        res.json(result.rows[0]);
    } catch (err) {
        logMessage("error", `Failed to update member: ${err.message}`, "UpdateMember");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete member
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid member ID" });
    }

    try {
        const result = await pool.query("DELETE FROM member WHERE mem_id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            logMessage("warn", `Member ID ${id} not found`, "DeleteMember");
            return res.status(404).json({ error: "Member not found" });
        }

        logMessage("info", `Deleted member ID ${id}`, "DeleteMember");
        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        logMessage("error", `Failed to delete member: ${err.message}`, "DeleteMember");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
