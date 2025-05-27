const express = require("express");
const multer = require("multer");
// Import your Product model
const router = express.Router();
const Product = require("../models/product");


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames based on timestamp
  },
});

const upload = multer({ storage: storage });

// Add a new product
router.post("/add-product", upload.array("images", 3), async (req, res) => {
  try {
    console.log("✅ Received Data:", req.body); // Debugging line
    console.log("✅ Uploaded Files:", req.files); // Debugging line

    if (!req.body.brand) {
      return res.status(400).json({ error: "Brand is required!" });
    }

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      originalPrice: req.body.originalPrice,
      offerPrice: req.body.offerPrice,
      stock: req.body.stock,
      images: req.files.map((file) => file.path), // Store file paths in the images array
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all products
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("view product:",products)
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, brand, originalPrice, offerPrice, stock, images } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand; // ✅ Add brand update
    product.originalPrice = originalPrice || product.originalPrice;
    product.offerPrice = offerPrice || product.offerPrice;
    product.stock = stock || product.stock;
    product.images = images || product.images;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// Search products based on name, description, or brand (case-insensitive)
// In your product routes file
// Example route: GET /api/product/search?query=iphone
router.get('/search/:query', async (req, res) => {
  const query = req.params.query;
  console.log("🔍 Search Query:", query);

  try {
    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error("🔴 Search Error:", error.message);
    res.status(500).json({ message: 'Server error during product search' });
  }
});


module.exports = router;
