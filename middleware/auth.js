const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { isBlacklisted } = require("../controllers/authController");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = auth.split(" ")[1];

  if (isBlacklisted(token))
    return res.status(401).json({ message: "Token has been invalidated, please login again" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) return res.status(401).json({ message: "Admin not found" });
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired, please login again" : "Invalid token";
    res.status(401).json({ message: msg });
  }
};
