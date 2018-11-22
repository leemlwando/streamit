const {ffprobe} = require('../ffmpeg');
const path = require('path');
const processStream = require('../processStream');
const cleanTmpDir = require('../cleanTmpDir');
module.exports = (destinationFolder,filename,options,req,success,failure)=>{
    // console.log('inspect stream...')
    let pathToFile = `${destinationFolder}${path.sep}${filename}${options._user}`;
    ffprobe(pathToFile,(data)=>{
        codec_type = data.streams[0].codec_type;
        
        data.user_id = options._user;
        
        switch(codec_type){
            case "video":
                processStream(destinationFolder,pathToFile,filename,data,options,req,success,failure);
                break;
                default:
                    failure({reason:"unsported media format"})
        }
    },(err)=>{
        cleanTmpDir(destinationFolder,success,failure);
    })   
}