const express = require('express');
const router = express.Router();

const {home} = require("./home");
const {login,register} = require('./authentication');
const uploads = require('./uploads');
const streaming = require('./streaming');
const developers = require("./developers");
const catalogs = require("./catalogs");


/**
 * HOME or /
*/

router.get("/",home.client.get);

/**
 * AUTHENTICATION
*/

//REGISTER CLIENT
router.get("/auth/register",register.client.get);

router.post("/auth/register",register.client.post);

//LOGIN ClIENT
router.get('/auth/login',login.client.get);

router.post('/auth/login',login.client.post);

//GET DEVELOPERS API TOKEN

router.get("/client/developers/token",developers.getDevelopersToken.client.get);


/**
 * CATALOGUE SERVICES
*/

//video catalog service
router.get("/client/catalogs/videos",catalogs.client.get);
//audio catalog services

//image catalog services


/*
    UPLOADS or /uploads
*/

// router.get("/uploads",uploads.client.get);

// router.post("/uploads", uploads.client.post);


/**
 * TO BE DONE
*/
// //streaming

// /*
//     @returns GET
// */
// router.get('/streaming/video/:version/:public_id',video.get);
// router.get('/streaming/audio',audio.get);
// router.get('/streaming/images',images.get);

// /*
//     //*POST*\\
// */



// //audio streaming




module.exports = router;