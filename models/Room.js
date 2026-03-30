const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: true },
    location: { type: String, required: true, trim: true },
    area: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    priceWithBreakfast: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    video: { type: String, default: "" },
    availableFrom: { type: Date, default: null },
    availableTo: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate roomId before saving
roomSchema.pre("save", async function (next) {
  if (this.roomId) return next();

  const locationCode = this.location.slice(0, 3).toUpperCase();
  const categoryCode = this.category.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3);

  const count = await mongoose.model("Room").countDocuments({
    location: this.location,
    category: this.category,
  });

  this.roomId = `${locationCode}-${categoryCode}-${String(count + 1).padStart(3, "0")}`;
  next();
});

module.exports = mongoose.model("Room", roomSchema);
