const express = require("express");
const router = express();


router.get("/",(req,res,next)=>res.render("home/index"));


module.exports = router