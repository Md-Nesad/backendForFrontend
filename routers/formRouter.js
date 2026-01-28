const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Form = require("../models/formSchema");
const authMiddleWare = require("../middleware/authMiddleware");

// POST form + image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const form = new Form({
      name,
      email,
      message,
      image: `/uploads/${req.file.filename}`, // public path
    });

    await form.save();
    res.status(201).json({ message: "Form submitted successfully", form });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all forms
router.get("/get", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
