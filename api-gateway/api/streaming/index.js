module.exports = {
    client:{
        catalogs:{
            get:(req,res,next)=>res.json({success:true,message:"catalogs service"})
        },
        streaming:{}
    },
    admin:{}
}