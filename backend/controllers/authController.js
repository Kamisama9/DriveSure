// controllers/authController.js
const db = require("../config/db"); // should be a mysql2 connection
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * Basic validation for signup inputs.
 * Returns an array of error messages (empty when valid).
 */
const validateUserInput = (data) => {
  const errors = [];
  const { email, phone_number, password, name, role } = data;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid or missing email");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (!name || !name.trim()) {
    errors.push("Name is required");
  }
  if (!role || !["rider", "driver"].includes(role)) {
    errors.push("Role must be either 'rider' or 'driver'");
  }
  if (phone_number && !/^\+?[0-9]{7,15}$/.test(String(phone_number))) {
    errors.push("Invalid phone number format");
  }

  return errors;
};

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    let {
      email,
      phone_number,
      password,
      name,
      city,
      state,
      role,
      role_description,
    } = req.body || {};

    // Normalize inputs
    email = typeof email === "string" ? email.trim().toLowerCase() : email;
    name = typeof name === "string" ? name.trim() : name;
    city = city ? String(city).trim() : null;
    state = state ? String(state).trim() : null;
    role_description = role_description ? String(role_description).trim() : null;

    // Validate input
    const errors = validateUserInput({ email, phone_number, password, name, role });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if email already exists
    const [existingUser] = await db.promise().query(
      "SELECT id FROM drivesure.users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create user
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    await db.promise().query(
      `INSERT INTO drivesure.users
        (id, email, phone_number, password_hash, name, city, state, role, role_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        email,
        phone_number || null,
        password_hash,
        name,
        city,
        state,
        role,
        role_description,
      ]
    );

    return res
      .status(201)
      .json({ message: "Signup successful", user: { id, email, role } });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : email;

    const [results] = await db
      .promise()
      .query(
        "SELECT id, email, role, password_hash FROM drivesure.users WHERE email = ? LIMIT 1",
        [normalizedEmail]
      );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Attach minimal user info to session
    req.session.user = { id: user.id, email: user.email, role: user.role };
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("Session save error:", saveErr);
        return res.status(500).json({ error: "Session save failed" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ error: "Session destroy failed" });
      }
      // Ensure this matches your express-session cookie name
      res.clearCookie("drivesure.sid");
      return res.json({ message: "Logout successful" });
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /auth/me
exports.me = (req, res) => {
  if (req.session?.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ error: "Not authenticated" });
};
