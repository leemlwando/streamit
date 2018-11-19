module.exports = {
    client:{
        // get:(req,res,next)=>res.json({success:true,message:"welcome to streamit , a microtech streaming software as a service"})
        get:(req,res,next)=>res.render("index")
    },
    admin:{}
}