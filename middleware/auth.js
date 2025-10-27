const jwt = require("jsonwebtoken");
const JWT_SECRET = "super_secret_key"; // Move to .env for production

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
};
