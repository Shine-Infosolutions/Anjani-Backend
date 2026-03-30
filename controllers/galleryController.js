const Gallery = require("../models/Gallery");
const { cloudinary } = require("../middleware/cloudinary");

// GET /api/gallery — public
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items.map((i) => i.imageUrl));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gallery — admin (upload images)
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const docs = await Gallery.insertMany(
      req.files.map((f) => ({ imageUrl: f.path }))
    );
    res.status(201).json(docs.map((d) => d.imageUrl));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/gallery — admin (remove one image)
exports.deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await Gallery.deleteOne({ imageUrl });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
