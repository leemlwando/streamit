

module.exports.home = {
    client:{
        get:(req,res,next)=> res.json({status:200,success:true,message:`welcome to Streamit, an Open Source Streaming as a Backend Service. It provides Streaming services as a backend service for applications that may be in need of an already made streaming backend. It allows you to stream music,images, and video and transcode your media on third party services like cloudinary`,contact:{phone:'+260950482560',email:"leemlwando@gmail.com",cto:"lee lwando"}})
    },

    admin:{
        get:(req,res,next)=>res.json({status:200,success:true,message:"welcome to microTech Streamit gateway API",contact:{phone:'+260950482560',email:"leemlwando@gmail.com",cto:"lee lwando"}})
    } 
}