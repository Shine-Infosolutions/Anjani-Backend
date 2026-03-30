const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// In-memory token blacklist (use Redis in production)
const blacklist = new Set();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.isBlacklisted = (token) => blacklist.has(token);

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin._id);
    res.json({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN,
      admin: { email: admin.email, id: admin._id },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  — verify token & return admin info
exports.getMe = async (req, res) => {
  res.json({ admin: { email: req.admin.email, id: req.admin._id } });
};

// POST /api/auth/logout  — blacklist the token
exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  blacklist.add(token);
  res.json({ message: "Logged out successfully" });
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields required" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.comparePassword(currentPassword)))
      return res.status(401).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Seed first admin from .env (call once on server start)
exports.seedAdmin = async () => {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log("✅ Admin seeded:", process.env.ADMIN_EMAIL);
  }
};
