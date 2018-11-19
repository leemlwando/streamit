const parseVideo = require('./videos');

module.exports = {
    video:{
        get:(req,res,next)=>{
            return parseVideo(req,res,next);
        },
        post:(req,res,next)=>{
            res.json({sucess:true,status:200,message:"This is Streamits video streaming api,please refer to documentaion for more info", date:new Date()});
            
        }
    },
    audio:{
        get:(req,res,next)=>{
            res.json({sucess:true,status:200,message:"This is Streamits audio streaming api,please refer to documentaion for more info", date:new Date()})
        },
        post:(req,res,next)=>{}
    },
    images:{
        get: (req,res,next)=>{
            res.json({sucess:true,status:200,message:"This is Streamits image streaming api,please refer to documentaion for more info", date:new Date()})
        },
        post: (req,res,next)=>{}
    }
}