// Import express
import express from "express";

// Create app
const app = express();

// Port
const PORT = 3000;

// Serve static files from public
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
