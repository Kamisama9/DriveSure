// server.js
const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/auth");
const initSchema = require("./db/initSchema");
const tripsRoutes = require("./routes/trips");

const verificationRoutes = require("./routes/verifications");

const bookingRoutes = require("./routes/booking")

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(sessionMiddleware);

// Initialize DB schema
initSchema();

// Mount routes
app.use("/auth", authRoutes);
app.use("/trips", tripsRoutes);

app.use("/verifications", verificationRoutes);
app.use("/bookings",bookingRoutes);

// Start server
app.listen(4002, () => console.log("Server running on port 4002"));
