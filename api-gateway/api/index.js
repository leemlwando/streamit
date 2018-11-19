const express = require('express');
const router = express.Router();

const {home} = require("./home");
const {login,register} = require('./authentication');
const {uploads} = require('./uploads');
const {images,video,audio} = require('./streaming');


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





/*
    UPLOADS or /uploads
*/

router.get("/uploads",uploads.client.get);

router.post("/uploads", uploads.client.post);

/*
    POST UPLOADS IMAGES
*/
// router.post('/uploads/images',uploads.post);

/*
    POST UPLOADS VIDEO
*/

// router.post('/uploads/videos',uploads.post);

/*
    POST UPLOADS AUDIO
*/
// router.post('/uploads/audios',uploads.post);


//streaming

/*
    @returns GET
*/
router.get('/streaming/video/:version/:public_id',video.get);
router.get('/streaming/audio',audio.get);
router.get('/streaming/images',images.get);

/*
    //*POST*\\
*/



//audio streaming




module.exports = router;