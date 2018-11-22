const {other} = require('../../../../lib/db/buckets');
const fs = require('fs');
const path = require('path');
const cleanTmpDir = require('../cleanTmpDir');
const cloudinary = require('../uploadToCloudinary');
const uui = require('uuid/v4');
module.exports = (destinationFolder,destinationFile,filename,metadata,options,req,success,failure)=>{
    let file_id = uui()
    
    const DBStreamOut = other.openUploadStream(file_id,{metadata:{options,
        metadata,original_file_name:filename
    }});
    const DBStreamIn = fs.createReadStream(destinationFile);

    //stream file to database
    DBStreamIn.pipe(
        DBStreamOut.on("error",(err)=>{
           
            failure({reason:"an error streaming file, plese try again later"});
        })
        ).on("finish",()=>{
           //done streaming file to database, remove files
           cloudinary(destinationFile,file_id, options,req,(result)=>{
            console.log("inititializing cleanup")
              cleanTmpDir(destinationFolder,success,failure,result);
        })
     
        })


      

}