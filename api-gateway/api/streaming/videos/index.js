const request = require('request');

module.exports = (req,res,next)=>{
      let {} = req.query;
    let {version, public_id} = req.params;
    let port = 6000;
    let host = "127.0.0.1";
    console.log("here", req.params)
    // let url = `http://${host}:${port}/api/v1/streaming/video/${version}?video_id=${video_id}&version=${version}&user_token=${user_token}&public_id=${public_id}`
    let url = `http://${host}:${port}/api/v1/streaming/video/${version}/${public_id}`
    request.get(url).on("error",(err)=>{
        console.log(err);
        next({status:500,message:"service unavailable"});
    }).pipe(res);
}