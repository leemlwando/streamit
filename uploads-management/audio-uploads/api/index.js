const express = require('express');
const router = express.Router();
const uploads = require('./uploads');
const home = require('./home');

/*
* GET home
*/

router.get('/',home.get);

/*
* POST home
*/

router.post('/',home.post);

/*
* GET uploads
*/

router.get('/uploads/audios', uploads.get);


/*
* POST uploads
*/

router.post('/uploads/audios', uploads.post);




module.exports = router;