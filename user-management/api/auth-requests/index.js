const {isUser,isDeveloper} = require("./lib");
module.exports = {
    client:{
        isUser:{
            get:(req,res,next)=>isUser(req,res,next)
        },
        isDeveloper:{
            get:(req,res,next)=>isDeveloper(req,res,next)
        }
    },
    admin:{}
}