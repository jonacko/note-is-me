// Dependencies
// require = load and cache JS modules

const express = require("express");
const path = require("path");
const fs = require("fs");

// to give each note a unique id (universally unique identifier)
const uuid = require('uuid');


// Port = a logical connection used by programs and services to exchange information (ranges from 65535)
// common port nos = 80/443 = web pages; 21 = ftp; 25 = email
// generally convention to use 4 digit no. higher than 1024 so it doesn't interfere with reserved ports.  3000 often used in Express - number is arbitrary
// 'env' means 'environment' - you can use this to store environment specific configuration or settings for your application

const app = express();
const PORT = process.env.PORT || 3000;

// ****** Middlewear *****

// Middlewear for parsing JSON  and url encoded from data
// 'use' = a method to configure the middlewear - called every time a request is sent to the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewear for static files
app.use(express.static("public"));

// Creates variable for notes saved in db.json file
let notes = require("./db/db.json");



//Middlewear for API router
// app.use("/api/notes", require("./middleware/api"));


// ************ HTML ROUTES ************

// Get route for notes page
// AC: 'GET /notes' should return the notes.html file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});



// ************ API ROUTES ************

// Display notes
app.get("/api/notes", function (_req, res) {
  // console.log('notes have been fetched');
  fs.readFile("db/db.json", "utf8", function (err, note) {
    console.log(note);
    if (err) {
      console.log(err);
      return;
    }
    const data = JSON.parse(note);
  
    res.json(data);
  });
});

// Create new note
app.post("/api/notes", function (req, res) {


  // saves unique id using npm uuid
  let id = uuid.v4();


  let newNote = {
    id: id,
    title: req.body.title,
    text: req.body.text,
  };
  console.log(newNote);
  notes.push(newNote);
  const stringifyNote = JSON.stringify(notes);
  res.json(notes);
  fs.writeFile("db/db.json", stringifyNote, (err) => {
    if (err) console.log(err);
    else {
      console.log("Note saved to db.json!");
    }
  });
});

// Delete note
app.delete("/api/notes/:id", function (req, res) {
console.log(req.params.id);
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err){
      console.log(err);
    }
    let updatedNotes = JSON.parse(data).filter((note) => {
  
      return note.id !== req.params.id;
    });
    notes = updatedNotes;
    const stringifyNote = JSON.stringify(updatedNotes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note successfully deleted from db.json");
      }
    });
    res.json(stringifyNote);
  });
});

// Get route for landing page
// AC: 'GET *' should return the index.html file

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts server to begin listening

app.listen(PORT, function () {
  console.log("App listening at PORT " + PORT);
});
