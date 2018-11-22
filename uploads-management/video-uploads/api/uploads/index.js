const {parseUploads} = require("../../lib");

module.exports.uploads = {
    get:(req,res,next)=>{},
    post:(req,res,next)=>{
        return parseUploads(req,res,next);
    }
}