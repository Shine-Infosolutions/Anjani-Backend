const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { upload } = require("../middleware/cloudinary");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadImages,
  deleteImage,
  getMetaOptions,
} = require("../controllers/roomController");

// Public
router.get("/", getAllRooms);
router.get("/meta/options", getMetaOptions);
router.get("/:id", getRoomById);

// Admin protected
router.post("/", protect, createRoom);
router.put("/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);
router.post("/:id/images", protect, (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, uploadImages);
router.delete("/:id/images", protect, deleteImage);

module.exports = router;
