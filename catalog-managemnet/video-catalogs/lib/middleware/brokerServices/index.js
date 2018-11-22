const parsePing = require("parseping");
const parseCallServices = require("parsecallservices");


function parsePing(err,results){
    
}

module.exports = {
    ping : (req,parameters)=>parsePing(req,parameters,(err)),
    call : (req,parameters)=>parseCallServices(req,parameters)
}