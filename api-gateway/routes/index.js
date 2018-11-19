const express = require("express");
const router = express.Router();
const home = require("./home");


/**
 * HOME
*/
//client facing index
router.get("/",home.client.get);


















module.exports = router;