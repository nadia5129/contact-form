// Import express
import express from "express";
import mysql from "mysql2";

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
  res.render("contact-form");
});

//cofirmation route
app.get('/confirmation', (req,res) => {
  res.render('confirmation');
});

//admin route, reads all contacts from mysql
app.get("/admin", async (req, res) => {
  try {
    const [contacts] = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.render("admin", { contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Error loading admin page");
  }
});

//submit route
app.post("/confirmation", async (req, res) => {
try{
  const newContact={
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    title: req.body.title,
    company: req.body.company,
    lurl: req.body.lurl,
    meet: req.body.meet,
    other: req.body.other,
    message: req.body.message,
  };
  
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
