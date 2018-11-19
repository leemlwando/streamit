const {parseRegister,parseLogin} = require("./lib");
module.exports = {
    login:{
        client:{
            get:(req,res,next)=>{
                res.json({success:true,code:200,message:"welcome to the login page. please refer to documentation for more info.",date:new Date()});
            }, 
            post:(req,res,next)=>parseLogin(req,res,next)
        },

        admin:{
            get:(req,res,next)=>{
                res.json({success:true,code:200,message:"welcome to the login page. please refer to documentation for more info.",date:new Date()});
            }, 
            post:(req,res,next)=>{res.send("loged in")}
        }
    },

    register:{

        client:{
            get: (req,res,next)=>{
                res.json({success:true,code:200,message:"welcome to the register page. please refer to documentation for more info."});
            },
            post:   (req,res,next)=>parseRegister(req,res,next)
        },

        admin:{
            get: (req,res,next)=>{
                res.json({success:true,code:200,message:"welcome to the register page. please refer to documentation for more info."});
            },
            post:   (req,res,next)=>{res.send("registered")}
        }
        
    }
       
}