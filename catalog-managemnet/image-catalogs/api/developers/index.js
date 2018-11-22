const {parseDevelopers} = require("./lib");
module.exports = {
    getDevelopersToken:{
        client:{
            get:(req,res,next)=>parseDevelopers(req,res,next)
        },
        admin:{}
    }
}