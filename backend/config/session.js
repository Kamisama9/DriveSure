// config/session.js
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const store = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "drivesure",
});

module.exports = session({
  key: "drivesure.sid",
  secret: "change_this!",
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
});
