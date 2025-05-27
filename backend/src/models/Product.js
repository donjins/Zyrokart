const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    brand: { type: String, required: true, index: true },
    originalPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Create text index for search functionality
productSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text'
}, {
  weights: {
    name: 3,
    brand: 2,
    description: 1
  }
});

module.exports = mongoose.model("Product", productSchema);
