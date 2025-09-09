// server.js
const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/auth");
const initSchema = require("./db/initSchema");
const tripsRoutes = require("./routes/trips");
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
// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
