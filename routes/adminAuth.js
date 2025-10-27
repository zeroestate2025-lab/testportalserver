const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const router = express.Router();
const JWT_SECRET = "super_secret_key";

// Register admin (use only once manually)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashed });
    await newAdmin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "6h" });
    res.json({ token, role: "admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
