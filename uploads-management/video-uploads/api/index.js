const express = require('express');
const router = express.Router();
const {other} = require('../lib/db/buckets')
const {getDB} = require('../lib/db/conn');
const ObjectId = require('mongodb').ObjectId

const {uploads} = require("./uploads");
const {home} = require("./home");

/**
 * HOME
*/

router.get("/",home.get)
    .get("/home",home.get)
        .get("/index",home.get);


/**
 * UPLOADS
*/

router.post("/uploads/videos",uploads.post);


/**
 * STREAMING
*/

module.exports = {router,home};









// //test streaming
// router.get('/streaming/video',(req,res,next)=>{
//         // console.log(req.query)
//         let {video_id, user_id} = req.query;
//         let db = getDB();
//         let id = "5bc4af035baa825dfac98579";
//         let col = db.collection("other.files"); 

//         res.status(206)

//         if(!video_id){
//             return res.json({success:false,message:"please provide a video id"})
//         }
        
//         other.openDownloadStream(new ObjectId(video_id)).on("error",(err)=>{
//             console.log(err);
//         }).pipe(res).on("error",(err)=>{
//             res.send({success:false,err:err});
//         });
  
// })



// module.exports = router;