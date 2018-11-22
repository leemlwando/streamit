const cloudinary = require('cloudinary');
const {getDB} = require("../../../../lib/db/conn");
const config = require("../../../../config");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

let default_eager_transformations = {
   dash:{streaming_profile:"4k",format:"m3u8"},
    hls:{streaming_profile:"4k",format:"mpd"},
}

module.exports = (fileToUpload,public_id, options,req,callback)=>{
    const {_width,_height,_background,_crop,_audio_codec,_gravity,_notifcation_url} = options._transformations;
    console.log('cloudinary')
    const up_options =  {
        resource_type: "video",
        eager:[
                default_eager_transformations.dash,
                default_eager_transformations.hls,
                {
                
                width: _width,
                height: _height,
                background: _background,
                crop: _crop,
                audio_codec:_audio_codec,
                gravity:_gravity

                }, 
        ],
            eager_async: true,
            eager_notification_url: _notifcation_url,
            public_id
       }
    
          
    cloudinary.v2.uploader.upload( fileToUpload,up_options,function(error,result){
        // console.log('cloudinary upload')
        // console.log("result",result);
        // console.log("error",error)

        if(error){
    
            return callback(error);
        }


        getDB().collection("other.files").updateOne({"filename":result.public_id},{
            $set:{"metadata.cloudinary":result}
        },function(err,docs){
            /**
             * @TODO {SEND NOTIFICATIONS AFTER UPLOAD}
            */
            // config.broker.call("notficaions.done",result,{nodeID:"uploads-catalog-service"})
            // .then(res=>console.log(res))
            //     .catch(err=>console.log(err));
        })
       
    
    })  


}