// routes/auth.js
const router = require("express").Router();
const { signup, login, logout, me } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

module.exports = router;
