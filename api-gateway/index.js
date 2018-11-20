const ApiService = require("moleculer-web");
const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const setup = require("./config");

const APIRoutes = require('./api'); //import api routes

setup.serviceConfig.mixins.push(ApiService);
setup.serviceConfig.settings.use.push(APIRoutes);
const svc = setup.broker.createService(setup.serviceConfig); //create service instance

const app = express(); //create app instance

app.use(cors()); //set cross origin request headers
app.use(bodyParser.json()); //parse json bodies
app.use(bodyParser.urlencoded({extended:false}));
app.use("/api/v1",svc.express());

app.use(setup.catch404);
app.use(setup.errorHandler);

module.exports = {app,broker:setup.broker};