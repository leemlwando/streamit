const fs = require('fs');
const path = require('path');
const OS = require('os');

const inspectStream = require('../inspectStream');

const {unsupportedContent, other} = require('../parseErrors');

module.exports = (filename,fileStream,options,req,success,failure)=>{
 
    fs.mkdtemp(path.join(OS.tmpdir(),`${filename}-`), (err,pathToFile)=>{

        let folder = pathToFile.split("/tmp/")[1];
        fileStream.pipe(fs.createWriteStream(path.join(OS.tmpdir(),`${path.sep}${folder}${path.sep}${filename}${options._user}`))).on("finish",()=>{
            inspectStream(pathToFile,filename,options,req,success,failure);
        })
    })
}