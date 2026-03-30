const express = require("express");
const router = express.Router();
const { getProfileImage, uploadProfileImage } = require("../controllers/profileImageController");
const { upload } = require("../middleware/cloudinary");
const { protect } = require("../middleware/auth");

router.get("/", getProfileImage);
router.post("/", protect, upload.single("image"), uploadProfileImage);

module.exports = router;
