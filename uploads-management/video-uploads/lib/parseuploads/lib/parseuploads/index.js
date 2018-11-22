const Busboy = require('busboy');
const parseStreams = require('../parseStreams');
const parseVideo = require('../parseVideo');
//import error handler
const {unsupportedContent} = require('../parseErrors');
const createError = require("http-errors");

let errors;
let success;
let uploadedFiles;
let options;

module.exports = (req,res,next)=>{
    //create busboy instance
    const busboy = new Busboy({headers:req.headers});
    // console.log(req.query)
    //initiate error bucket
    errors = [];

    //initiate file counter
    uploadedFiles = {
        n:0
    };

    //listen to file event
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {  
        
        uploadedFiles.n++;

        //check mimetype ps. only accept video files, drop all none video files
        let type = mimetype.split("/")[0];

        let {user,width,height,crop,profile,format,backgound,gravity,audio_codec} = req.query;

        if(!user)return next(createError(403,{success:false,message:"missing user"}));

        options = {
            _user: req.query.user,
            _transformations:{
                _width:width || null,
                _height:height || null,
                _crop:crop || null,
                _profile:profile || "full_hd",
                _format:format || "mpd",
                _backgound:backgound || null,
                _gravity:gravity || null,
                _audio_codec:audio_codec || null
            },
        }


        switch(type){
            case "video":
                parseVideo(filename,file,options,req,(data)=>{
                    uploadedFiles.cloudinaryResponse = data;
                },(err)=>{
                    errors.push(err);
                });
                break;
            case "image":
            let err1 = Object.assign({},unsupportedContent)
                err1.type = "image";
                err1.mimetype = mimetype;
                err1.filename=filename;
                errors.push(err1);
                // success = false;
                file.on("data",(data)=>console.log(err1));
                break;
            case "audio":
            let err2 = Object.assign({},unsupportedContent)
                err2.type = "audio";
                err2.mimetype = mimetype;
                err2.filename=filename;
                errors.push(err2);
                // success = false;
                file.on("data",(data)=>console.log(err2));
                break;
                default:
                    parseStreams(filename,file,mimetype,(data)=>{
                    
                    },(error)=>{
                        errors.push(error)
                    });
        }
    });

    //listen to field event
    busboy.on("field",(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype)=>{
      
    });

    //listen to finish event
    busboy.on('finish', function() {
        req.$ctx.broker.emit("notifications.saved",uploadedFiles,["audio-uploads-service","catalogue-service","notification-service"]);
    
        res.json({success:true,errors,uploadedFiles});
    });

    //pipe request to busboy
    req.pipe(busboy);

}