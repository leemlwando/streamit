const parseUpload = require("./parseuploads");

module.exports.uploads = {
    client:{

        get:(req,res,next)=>{res.json({success:true,status:200,message:"welcome to the uploads api, you can upload your music,video and images here. please refer to documentation for info"})},

        post:(req,res,next)=>{
        
            return parseUpload(req,res,next);
        }
    },
    admin:{}
}