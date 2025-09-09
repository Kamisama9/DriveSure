// db/initSchema.js
const db = require("../config/db");

const schema = `
CREATE DATABASE IF NOT EXISTS drivesure;
USE drivesure;
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(16) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(20),
  state VARCHAR(20),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  role ENUM('rider','driver','admin') NOT NULL,
  role_description VARCHAR(255),
  status ENUM('active','suspended','deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

module.exports = function initSchema() {
  schema.split(";").forEach((q) => {
    if (q.trim())
      db.query(q, (err) => err && console.error("Schema error:", err.message));
  });
};
