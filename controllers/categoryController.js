const Category = require("../models/Category");

// GET /api/categories  — public
exports.getAll = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/categories  — admin
exports.create = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Category already exists" });
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/categories/:id  — admin
exports.update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, isActive: req.body.isActive },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/categories/:id  — admin
exports.remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
