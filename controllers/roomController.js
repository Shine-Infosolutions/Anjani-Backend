const Room = require("../models/Room");
const { cloudinary } = require("../middleware/cloudinary");

// GET /api/rooms  — public
exports.getAllRooms = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.location) filter.location = req.query.location;
    if (req.query.category) filter.category = req.query.category;

    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rooms/:id  — public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rooms  — admin
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/rooms/:id  — admin
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/rooms/:id  — admin
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ roomId: req.params.id });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rooms/:id/images  — admin (upload images to Cloudinary)
exports.uploadImages = async (req, res) => {
  try {
    console.log("upload req.files:", req.files);
    console.log("upload req.params.id:", req.params.id);
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const urls = req.files.map((f) => f.path); // Cloudinary URL
    console.log("cloudinary urls:", urls);

    const room = await Room.findOneAndUpdate(
      { roomId: req.params.id },
      { $push: { images: { $each: urls } } },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ images: room.images });
  } catch (err) {
    console.error("uploadImages error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/rooms/:id/images  — admin (remove one image)
exports.deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Extract public_id from Cloudinary URL and delete
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    const room = await Room.findOneAndUpdate(
      { roomId: req.params.id },
      { $pull: { images: imageUrl } },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ images: room.images });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rooms/meta/options  — public (locations + categories list)
exports.getMetaOptions = async (req, res) => {
  try {
    const locations = await Room.distinct("location", { isActive: true });
    const categories = await Room.distinct("category", { isActive: true });
    res.json({ locations, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
