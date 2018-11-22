module.exports.home = {
    get:(req,res,next)=>res.status(200).json({success:true, message:"Welcome to MicroTech Streamit API"})
}