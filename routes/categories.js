const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getAll, create, update, remove } = require("../controllers/categoryController");

router.get("/", getAll);
router.post("/", protect, create);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

module.exports = router;
