require('dotenv').config();
const express = require('express');
// const {ServiceBroker} = require('moleculer');
const APIGwService = require('moleculer-web');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const createError = require('http-errors');
require('./lib/db/').db

//import database
const db  = require('./lib/db').db.connectDbServer;

//initialize database
db(function(err){
    //catch db errors
    if(err){
        return process.exit(1);
    }

// import routes
const {router,home} = require('./api');


//import configurations
const config = require('./config');

//create express app
const app = express();

//create moleculer broker
// const broker = new ServiceBroker(config.broker);

//create service
config.service.mixins.push(APIGwService);
    //create middleware
config.service.settings.use.push(router);
config.service.settings.use.push(bodyParser.json());
config.service.settings.use.push(bodyParser.urlencoded({extended:false}));
config.service.settings.use.push(cors());
config.service.settings.use.push(logger("dev"));

const svc = config.broker.createService(config.service);
config.broker.loadServices(folder = "./services", fileMask = "**/*.service.js");

//create middleware
app.use(cors());
app.use('/api/v1',svc.express());
app.use("/",home.get);  
//catch 404 errors
app.use(function(req,res,next){
    next(createError(404, {}, {success:false, code:404}))
});

//catch errors
app.use(function(err,req,res,next){
    // console.log('error',err)
    res.status(err.code || 500);
    res.json({
        status:err.code,
        message:err.code===404 ? "page not found" : err.message,
        success:false
    })
})


app.listen(3040,()=>console.log('server started on port 3040'));

config.broker.start();

});

