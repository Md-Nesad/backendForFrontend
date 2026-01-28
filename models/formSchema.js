const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String },
    image: { type: String }, // image path
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", formSchema);
