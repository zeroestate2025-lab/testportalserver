const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = "super_secret_key";

// Fixed credentials
const CONST_USER = {
  username: "Univision",
  password: "user@123",
};

// User login (constant credentials)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === CONST_USER.username && password === CONST_USER.password) {
    const token = jwt.sign({ username, role: "user" }, JWT_SECRET, { expiresIn: "6h" });
    res.json({ token, role: "user" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

module.exports = router;
