const {parseUploads} = require("../lib");
module.exports = {
    service:{
        mixins:[],
        name:"image-uploads",
        settings:{
            ip:"0.0.0.0",
            port:5080,
            use:[],
            routes:[
                {
                    path:"/uploads",
                    aliases:{
                       
                        "POST /"(req,res){
                            return parseUploads(req,res,(err,results)=>{
                                res.json({results});
                            })
                        }
                    }
               }
            ]
        }
    },
    broker:{
        namespace:"dev",
        nodeID:"image-uploads-service",
        transporter:"redis"

    }
}