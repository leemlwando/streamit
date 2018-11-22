const {other} = require('../../../../lib/db/buckets');
const fs = require('fs');
const path = require('path');
const cleanTmpDir = require('../cleanTmpDir');
const cloudinary = require('../uploadToCloudinary');
const uui = require('uuid/v4');
module.exports = (destinationFolder,destinationFile,filename,metadata,success,failure)=>{
    let file_id = uui()
    const DBStreamOut = other.openUploadStream(file_id,{metadata:{
        metadata,original_file_name:filename
    }});
    const DBStreamIn = fs.createReadStream(destinationFile);

    //stream file to database
    DBStreamIn.pipe(
        DBStreamOut.on("error",(err)=>{
            // console.log(err)
            failure({reason:"An error streaming file, please try again later"});
        })
        ).on("finish",()=>{
           //done streaming file to database, remove files
           cloudinary(destinationFile,file_id,(result)=>{

            console.log("inititializing cleanup")
              cleanTmpDir(destinationFolder,success,failure,result);
        })
     
        })


      

}