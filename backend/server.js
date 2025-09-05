const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "admin",
});

// Create database and tables
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
    role ENUM('rider','driver', 'admin') NOT NULL,
    role_description VARCHAR(255),
    status ENUM('active','suspended','deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* Add all other tables here exactly as in your schema */

`;

schema.split(";").forEach((query) => {
	if (query.trim()) {
		db.query(query, (err) => {
			if (err) console.error("Schema error:", err.message);
		});
	}
});

// Signup API
app.post("/signup", async (req, res) => {
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
		"INSERT INTO drivesure.users (id, email, phone_number, password_hash, name, city, state, role, role_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
			res
				.status(201)
				.json({ message: "User created successfully", userId: id });
		}
	);
});

// Login API
app.post("/login", (req, res) => {
	const { email, password } = req.body;

	db.query(
		"SELECT * FROM drivesure.users WHERE email = ?",
		[email],
		async (err, results) => {
			if (err) return res.status(500).json({ error: err.message });
			if (results.length === 0)
				return res.status(404).json({ error: "User not found" });

			const user = results[0];
			const match = await bcrypt.compare(password, user.password_hash);
			if (!match) return res.status(401).json({ error: "Invalid credentials" });

			res.status(200).json({ message: "Login successful", user });
		}
	);
});

app.listen(3000, () => console.log("Server running on port 3000"));
