// const express = require("express");
// // import { registerUser, loginUser } from "../controllers/userController.js";

// const router = express.Router();

// // router.post("/register", registerUser);
// // router.post("/login", loginUser);

// export default router;
const express = require("express");
const router = express.Router();

// Define routes
router.get("/", (req, res) => {
  res.send("Product routes working!");
});

module.exports = router;
