const ProfileImage = require("../models/ProfileImage");
const { cloudinary } = require("../middleware/cloudinary");

// GET /api/profile-image — public
exports.getProfileImage = async (req, res) => {
  try {
    const doc = await ProfileImage.findOne();
    res.json({ imageUrl: doc ? doc.imageUrl : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/profile-image — admin (upload/replace)
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Delete old image from Cloudinary if exists
    const existing = await ProfileImage.findOne();
    if (existing) {
      const publicId = existing.imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      existing.imageUrl = req.file.path;
      await existing.save();
      return res.json({ imageUrl: existing.imageUrl });
    }

    const doc = await ProfileImage.create({ imageUrl: req.file.path });
    res.status(201).json({ imageUrl: doc.imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
