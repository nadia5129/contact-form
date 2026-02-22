// Import express
import express from "express";

// Create app
const app = express();

// Port
const PORT = 3005;

// Serve static files from public
app.use(express.static("public"));

//add middleware to allow express to read data thats in the form
app.use(express.urlencoded({extended: true}));


// create an array to store temp form submissions
const contacts =[];

// Home route
app.get("/", (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/home.html`);
});

//cofirmation route
app.get('/confirmation', (req,res) => {
  res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

//admin route that displays order arrays
app.get('/admin', (req, res) => {
  res.send(contacts);
});

//submit route
app.post('/confirmation', (req,res) => {

  //create a json object to store order data

  const Newcontact={
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    title: req.body.title,
    company: req.body.company,
    lurl: req.body.lurl,
    meet: req.body.meet,
    other: req.body.other,
    message: req.body.message,
    timestamp: new Date()
  };

  contacts.push(Newcontact);

  res.sendFile(`${import.meta.dirname}/views/confirmation.html`)

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
