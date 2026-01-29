const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const upload = require("../middleware/upload");
const uploadCloudinary = require("../utils/cloudinaryHelper");

router.post("/create", upload.array("image", 5), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => uploadCloudinary(file.buffer, "form-images")),
    );

    // const result = await uploadCloudinary(req.file.buffer, "form-images");

    const images = uploadResults.map((result) => result.secure_url);

    // const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      image: images,
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
