const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const product = new Product({
      name,
      image: `/uploads/${req.file.filename}`,
      price,
      category,
      description,
    });
    await product.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
