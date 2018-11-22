const {parseLogin} = require("./lib");
module.exports = {
    client:{
        post:(req,res,next)=>parseLogin(req,res,next)
    },
    admin:{}
}