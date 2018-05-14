"use strict";

//////////////////////
// Initialize
//////////////////////
const router = require("express").Router();
const jsonParser = require("body-parser").json();
const { buildSQL } = require("./sql");

//////////////////////
// Routes
//////////////////////
router.post(
    "/",
    jsonParser,
    (req, res) => {
        const { query } = req.body;
        const sql = buildSQL(query);
        
        console.log(sql);
        res.status(200).json({ sql });
    }
);

module.exports = { router };