const express = require("express");
const router = express.Router();
const { getGallery, uploadImages, deleteImage } = require("../controllers/galleryController");
const { upload } = require("../middleware/cloudinary");
const { protect } = require("../middleware/auth");

router.get("/", getGallery);
router.post("/", protect, upload.array("images", 20), uploadImages);
router.delete("/", protect, deleteImage);

module.exports = router;
