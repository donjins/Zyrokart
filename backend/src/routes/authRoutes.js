const express = require("express");
const nodemailer = require("nodemailer");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const otpStore = {};

// Configure session middleware (ensure it's added in `server.js` too)
router.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP email
const sendOTPEmail = async (email) => {
  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10-minute validity

  try {
    await transporter.sendMail({
      from: `YourApp Team <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Account",
      text: `Your OTP: ${otp} (Valid for 10 mins)`,
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP. Please try again." };
  }
};

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    const otpResponse = await sendOTPEmail(email);

    return res.json({ success: true, message: "Signup successful. OTP sent for verification.", otpResponse });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ success: false, message: "Signup failed. Try again later." });
  }
});

// OTP verification
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "OTP expired or invalid." });
  }

  if (otpStore[email].otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: "Incorrect OTP." });
  }

  if (Date.now() > otpStore[email].expiresAt) {
    delete otpStore[email]; // Clean expired OTP
    return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found. Please sign up again." });
    }

    delete otpStore[email]; // OTP verified, remove from store
    return res.json({ success: true, message: "OTP verified successfully! You can now log in." });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Login route with session storage
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: "Invalid email or password." });
  }

  req.session.user = { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin };

  return res.status(200).json({ success: true, message: "Login successful", user: req.session.user });
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Check if user session exists
router.get("/session", (req, res) => {
  if (req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  return res.status(401).json({ success: false, message: "No active session" });
});

module.exports = router;
