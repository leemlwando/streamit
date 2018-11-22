// const { ServiceBroker } = require("moleculer");
require("dotenv").config();
require("./lib/db/conn");
const ApiGateway = require("moleculer-web");
const express = require('express');
const config = require("./config");
// const createError = require('http-errors');

// const broker = new ServiceBroker(require('./moleculer.config'));

// const {ErrorMessages} = require("./lib");
const APIRoutes = require("./api");

config.serviceConfig.mixins.push(ApiGateway);
config.serviceConfig.settings.use.push(APIRoutes);
const svc = config.broker.createService(config.serviceConfig);
// const svc = broker.createService({
//     name: "user-service",
// 	mixins: [ApiGateway],

	
// 	settings: {
//         port: process.env.PORT || 5020,
//         use:[routes]
// 	}
// });

// broker.loadServices(folder = "./services", fileMask = "**/*.service.js");

const app = express();


app.use('/api/v1',svc.express());

//catch 404 errors
app.use(config.catch404);

//Catch All Errors
app.use(config.errorHandler);
// app.use(function(req,res,next){
//     next(createError(404, {}, {success:false, code:404}))
// })
// app.use(function(err,req,res,next){

//     res.status(err.code || 500);
//     res.json({
//         status:err.code && err.code.toString() === "11000" ? 401 : 500,
//         message:ErrorMessages(err),
//         success:false
//     })
// })


app.listen(3020,()=>console.log('server started on port 3020'));

// broker.start()
config.broker.start();