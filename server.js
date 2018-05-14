"use strict";

//////////////////////
// Initialize
//////////////////////
const express = require("express");
const morgan = require("morgan");
const app = express();
const { router } = require("./route");

//////////////////////
// Set up application
//////////////////////
app.use(express.static("public"));

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});

// Log HTTP layer
app.use(morgan("common"));

// Routes
app.use("/query", router);

// Error handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status).json({ message: err.message });
});

//////////////////////
// Set up application
//////////////////////
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});