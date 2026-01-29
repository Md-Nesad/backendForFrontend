const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: [{ type: String }],
    price: { type: Number, required: true },
    category: { type: String, enum: ["men", "women", "kids"], required: true },
    description: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);
