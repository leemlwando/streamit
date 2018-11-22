const {parseCatalogs} = require("./lib");

module.exports = {
    client:{
        get:(req,res,next)=>parseCatalogs(req,res,next)
    },
    admin:{}
}