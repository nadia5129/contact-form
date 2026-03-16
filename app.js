// Import express
import express from "express";
import mysql from "mysql2";
import {validateForm} from './validation.js';
import session from "express-session";

import dotenv from "dotenv";
dotenv.config();

// Create app
const app = express();

// Port
const PORT = 3005;

// Serve static files from public
app.use(express.static("public"));

//set up ejs as the view engine
app.set('view engine', 'ejs');

//add middleware to allow express to read data thats in the form
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false
}));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS test");
    res.json(rows);
  } catch (error) {
    console.error("DB test failed:", error);
    res.status(500).send(error.message);
  }
});

// Home route
app.get("/", (req, res) => {
  res.render('home');
});

// Contact form page
app.get("/contact-form", (req, res) => {
   res.render("contact-form", {
    errors: [],
    old: {}
  });
});

//cofirmation route
app.get("/confirmation", (req, res) => {
  res.render("confirmation", { contact: null });
});

//portfolio route
app.get("/portfolio", (req, res) => {
  res.render("portfolio");
});

//admin route, reads all contacts from mysql
app.get("/admin", (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect("/admin/dashboard");
  }

  res.render("admin-login", { error: null });
});
app.post("/admin/login", (req, res) => {
  const username = req.body.username ? req.body.username.trim() : "";
  const password = req.body.password ? req.body.password.trim() : "";

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.redirect("/admin/dashboard");
  }

  res.status(401).render("admin-login", {
    error: "Invalid username or password."
  });
});

app.get("/admin/dashboard", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin");
  }

  try {
    const [contacts] = await pool.query(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );

    res.render("admin", { contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Error loading admin page");
  }
});

//submit route
app.post("/confirmation", async (req, res) => {
  const newContact = {
    fname: req.body.fname ? req.body.fname.trim() : "",
    lname: req.body.lname ? req.body.lname.trim() : "",
    email: req.body.email ? req.body.email.trim() : "",
    title: req.body.title ? req.body.title.trim() : "",
    company: req.body.company ? req.body.company.trim() : "",
    lurl: req.body.lurl ? req.body.lurl.trim() : "",
    meet: req.body.meet ? req.body.meet.trim() : "",
    other: req.body.other ? req.body.other.trim() : "",
    message: req.body.message ? req.body.message.trim() : "",
    mailing: req.body.mailing || "",
    format: req.body.format || "",
    timestamp: new Date()
  };

  const valid = validateForm(newContact);

  if (!valid.isValid) {
    return res.status(400).render("contact-form", {
      errors: valid.errors,
      old: newContact
    });
  }

  try {
    const sql = `
      INSERT INTO contacts
      (fname, lname, email, title, company, lurl, meet, other, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      newContact.fname,
      newContact.lname,
      newContact.email,
      newContact.title,
      newContact.company,
      newContact.lurl,
      newContact.meet,
      newContact.other,
      newContact.message
    ];

    await pool.query(sql, values);

    res.render("confirmation", { contact: newContact });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).send("Error saving contact");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
