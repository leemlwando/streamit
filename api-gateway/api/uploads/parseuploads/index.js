const createError = require("http-errors");
const request = require("request");

let _routes = {
    video:"video-uploads",
    image:"image-uploads",
    audio:"audio-uploads" 
}

let _resources = {
    video:"videos",
    image:"images",
    audio:"audios"
}

module.exports = (req,res,next) =>{

    let {type} = req.query;

    if(!type)return next(createError(403,{message:"please provide an upload type e.g /uploads?type=audio"}));

    

   return routeRequest(req,type,(err,results)=>{
       if(err)return next(err);
      
       let _service = results.filter((result)=>result.name === _routes[type]);

        /**
         * @TODO {load balancing algorith in case of multiple instances of _service}
        */
        console.log(_service)
       _service.length ?  sendRequest(req,res,type,_service) : res.status(500).json({success:false, message:"service unavailable"});


   });
}


function sendRequest(req,res,type,instances){

    let {ip,port} = instances[0].settings;

    return req.pipe(request.post(`http://${ip}:${Number(port.toString().replace("5","3"))}/api/v1/uploads/${_resources[type]}?${req.url.split("?")[1]}&user=1234`).on("error",(err)=>console.log(err))).pipe(res).on("error",(error)=>console.log(error));
}



function routeRequest(request,type,done){

    let nodes = {
        audio:"audio-uploads-service",
        image:"image-uplaods-service",
        video:"video-uploads-service"
    };

    let services = {
        video:"$node.services",
        audio:"$node.services",
        image:"$node.services"
    }
  
    if(nodes[type] === undefined){
        return done({message:`please provide one of the following ["audio","image","video"]`});
    }

    let service = services[type];
    if(typeof(request) !== "object") throw TypeError(`expected request object but got ${typeof(request)}`);

    if(typeof(type) !== "string") throw TypeError(`expected type string but got ${typeof(type)}`);
    console.log("uploading files...")
    request.$ctx.broker.call(service)
        .then(res=>done(null,res))
            .catch(err=>done(err,false));

}