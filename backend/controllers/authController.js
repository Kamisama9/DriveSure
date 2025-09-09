// controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// POST /auth/signup
exports.signup = async (req, res) => {
  const {
    email,
    phone_number,
    password,
    name,
    city,
    state,
    role,
    role_description,
  } = req.body;
  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, 10);

  db.query(
    `INSERT INTO drivesure.users
      (id, email, phone_number, password_hash, name, city, state, role, role_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      email,
      phone_number,
      password_hash,
      name,
      city,
      state,
      role,
      role_description,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Signup successful" });
    }
  );
};

// POST /auth/login
exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT id, email, role, password_hash FROM drivesure.users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "User not found" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      req.session.user = { id: user.id, role: user.role };
      req.session.save();
      res.status(200).json({
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
      });
    }
  );
};

// POST /auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.clearCookie("drivesure.sid");
    res.json({ message: "Logout successful" });
  });
};

// GET /auth/me
exports.me = (req, res) => {
  if (req.session?.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ error: "Not authenticated" });
};
