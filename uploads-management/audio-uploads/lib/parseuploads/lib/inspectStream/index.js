const {ffprobe} = require('../ffmpeg');
const path = require('path');
const processStream = require('../processStream');
const cleanTmpDir = require('../cleanTmpDir');
module.exports = (destinationFolder,filename,user,success,failure)=>{
    
    let pathToFile = `${destinationFolder}${path.sep}${filename}${user}`;

    ffprobe(pathToFile,(data)=>{
        
        codec_type = data.streams[0].codec_type;
        
        data.user_id = user;
     
        switch(codec_type){
            case "video":
                processStream(destinationFolder,pathToFile,filename,data,success,failure);
                break;
                default:
                    failure({reason:"unsported media format"})
        }
    },(err)=>{
        cleanTmpDir(destinationFolder,success,failure);
    })   
}