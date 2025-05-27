const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import Database Connection & Routes
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // CORS configuration
app.use(morgan("dev")); // HTTP logging

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads")); // Ensure 'uploads' folder exists

// Session Setup

// Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI, // MongoDB connection string (ensure MONGO_URI is set)
  collection: "sessions", // Sessions collection in MongoDB
  ttl: 60 * 30, // Set session TTL to 30 minutes for real use
});

// Handle session store errors
store.on("error", (error) => {
  console.error("Session Store Error:", error);
});

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // Secret for session
    resave: false,
    saveUninitialized: false,
    store: store, // MongoDB session store
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent access via JavaScript (XSS protection)
      maxAge: 10 * 60 * 1000, // Session expiration time (10 minutes)
    },
  })
);

// Passport Authentication
require("./src/config/passport");
app.use(passport.initialize());
app.use(passport.session()); // Initialize passport session

// Multer Storage Configuration (for file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files saved to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// File Upload API (to handle file uploads)
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
