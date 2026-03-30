require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { seedAdmin } = require("./controllers/authController");

const app = express();

app.use(cors({
  origin: ["https://anjani-rooms.vercel.app","https://anjani-backend.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/categories", require("./routes/categories"));

app.get("/", (req, res) => res.json({ message: "Anjani Rooms API running 🏨" }));

// Connect DB → seed admin → start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedAdmin();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
