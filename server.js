// Dependencies
// require = load and cache JS modules

const express = require("express");
const path = require("path");
const fs = require("fs");

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

// Get route for notes page
// AC: 'GET /notes' should return the notes.html file.

// Middlewear for API router
// app.use("/api/notes", require("./middleware/api"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
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

// UUID - universally unique identifier
// gives each note a unique ID
