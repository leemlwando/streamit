const {parseDevelopersToken} = require("./lib");

module.exports = {
    client:{
        getDevelopersToken:{
            get:(req,res,next)=>parseDevelopersToken(req,res,next)
        }
    },
    admin:{}
}