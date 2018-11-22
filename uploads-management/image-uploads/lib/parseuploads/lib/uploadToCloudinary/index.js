const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

module.exports = (fileToUpload,public_id,callback)=>{
    console.log('cloudinary')
    const up_options =  {
        resource_type: "video",
        eager:[{ width: 300,
            height: 300,
            background: "green",
            crop: "pad"},
            { width: 300, height: 300,
                crop: "pad", audio_codec: "none" }, 
            { width: 160, height: 100,
                    crop: "crop", gravity: "south",
                    audio_codec: "none" } 
        ],
            eager_async: true,
            eager_notification_url: "http://microtechcloud.co",
            public_id
       }
    cloudinary.v2.uploader.upload( fileToUpload,up_options,function(error,result){
        console.log('cloudinary upload')
        console.log("result",result);
        console.log("error",error)
        callback(result);
    })  

}