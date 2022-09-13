// Dependencies
// require = load and cache JS modules

const express = require("express");
const path = require("path");
const fs = require("fs");

// to give each note a unique id
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

let notes = require("./db/db.json");



//Middlewear for API router
// app.use("/api/notes", require("./middleware/api"));

// ****** HTML ROUTES ******

// Get route for notes page
// AC: 'GET /notes' should return the notes.html file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Get route for landing page
// AC: 'GET *' should return the index.html file

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// ****** API ROUTES ******

// Display notes
app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(notes);
    });
  });

// Create new note
app.post("/api/notes", function (req, res) {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let id = randLetter + Date.now();
    let newNote = {
      id: id,
      title: req.body.title,
      text: req.body.text,
    };
    console.log(typeof notes);
    notes.push(newNote);
    const stringifyNote = JSON.stringify(notes);
    res.json(notes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note successfully saved to db.json");
      }
    });
  });

// Starts server to begin listening

app.listen(PORT, function () {
  console.log("App listening at PORT " + PORT);
});

// UUID - universally unique identifier
// gives each note a unique ID
