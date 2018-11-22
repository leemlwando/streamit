const express = require("express");
const router = express.Router();
const register = require("./register");
const login = require("./login") 
const developers = require("./developers");
const authenticateRequests = require("./auth-requests");

/**
 * HOME
*/



/**
 * REGISTER
*/

router.post("/auth/client/register",register.client.post);



/**
 * LOGIN
*/

router.post("/auth/client/login",login.client.post);


/**
 * ISSUE DEVELOPERS TOKEN
*/

router.get("/client/developers/token",developers.client.getDevelopersToken.get);

/**
 *  CONFIRM DEVELOPER TOKEN / API KEY
*/

router.get("/client/developers/apikey/isowner",authenticateRequests.client.isDeveloper.get);

/**
 * CONFIRM USER TOKEN
*/

router.get("/auth/client/isuser",authenticateRequests.client.isUser.get);




module.exports = router;