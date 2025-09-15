// routes/auth.js
const router = require("express").Router();
const { signup, login, logout, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", requireAuth, me);

module.exports = router;
