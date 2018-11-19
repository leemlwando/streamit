const ApiService = require("moleculer-web");
const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const {setup} = require("./config");
const path = require("path");

const app = express();

const APIroutes = require('./api'); //import API routes
const Routes = require("./routes"); //import routes

setup.serviceConfig.mixins.push(ApiService); //add api service mxing as global object
setup.serviceConfig.settings.use.push(bodyParser.urlencoded({extended:false}));
setup.serviceConfig.name = "api-servce"; //service name
setup.serviceConfig.settings.use.push(cors());
setup.serviceConfig.settings.use.push(APIroutes); //add routes
setup.serviceConfig.settings.use.push(bodyParser.json());

// console.log(setup.serviceConfig)
const _service = setup.broker.createService(setup.serviceConfig); //create service

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use("/static",express.static(path.join(__dirname,"/views")));
app.use('/api/v1',_service.express());
// app.use("/",Routes);


//catch 404 errors
app.use(function(req,res,next){
    next(createError(404, {}, {success:false, code:404}))
})

//catch all other errors
app.use(function(err,req,res,next){
    // console.log('error',err)
    res.status(err.code || 500);
    res.json({
        status:err.code || 500,
        message:err.code===404 ? "page not found" : err.message,
        reason:err.reason || null,
        example:err.example || null,
        success:false
    })
})


module.exports = {app,broker:setup.broker};

