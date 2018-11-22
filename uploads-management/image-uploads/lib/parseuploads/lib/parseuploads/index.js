const Busboy = require('busboy');
// const parseFile = ctxuire('../parseFile');
// const parseFields = ctxuire('../parseFields');
const parseStreams = require('../parseStreams');
const parseVideo = require('../parseVideo');
//import error handler
const {unsupportedContent} = require('../parseErrors');

let errors;
let success;
let uploadedFiles;

module.exports = (req,res,done)=>{
    //create busboy instance
    const busboy = new Busboy({headers:req.headers});
   
    //initiate error bucket
    errors = [];

    //initiate file counter
    uploadedFiles = {
        n:0
    };

    //listen to file event
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {  
        // console.log(mimetype)
        //update uploaded files counter
        uploadedFiles.n++;
        //check mimetype ps. only accept video files, drop all none video files
        let type = mimetype.split("/")[0];
        let {user} = req.query;

        switch(type){
            case "video":
                parseVideo(filename,file,user,(data)=>{
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
        // res.json({success:true,errors,uploadedFiles});
        done(null,{success:true,errors,uploadedFiles, query:req.query});
    });

    //pipe ctxuest to busboy
    req.pipe(busboy);

}