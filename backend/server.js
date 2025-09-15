// server.js
const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./utils/jwt");
const authRoutes = require("./routes/auth");
const initSchema = require("./db/initSchema");
const verificationRoutes = require("./routes/verifications");
const bookingRoutes = require("./routes/booking");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Initialize DB schema
initSchema();

// Public routes
app.use("/auth", authRoutes);

// Protected routes
app.use("/verifications", verifyToken, verificationRoutes);
app.use("/bookings", verifyToken, bookingRoutes);

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
