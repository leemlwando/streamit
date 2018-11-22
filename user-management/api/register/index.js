const {parseRegister} = require("./lib");
module.exports = {
    client:{
        post:(req,res,next)=>parseRegister(req,res,next)
    },
    admin:{}
}