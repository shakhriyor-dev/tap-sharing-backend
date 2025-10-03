const jwt = require("jsonwebtoken");
const SECRET = "supersecret"; // ⚠️ вынеси в .env

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ error: "Token expired or invalid" });
  }
}

module.exports = auth;
