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

    let {type,api_key} = req.query;

    if(!type)return next(createError(403,{message:"please provide an upload type e.g /uploads?type=audio"}));

    

    getServices(req,type,(err,results)=>{
       if(err)return next(err);
      
       let _service = results.filter((result)=>result.name === "user-service");

        /**
         * @TODO {load balancing algorith in case of multiple instances of _service}
        */
        if(_service.length){

            //check if developer api key is valid
            sendIsDeveloperRequest(req,api_key,_service,(err,payload)=>{
                if(err){
                    return next(createError(err));
                };

                //check if uploads service is avalable
                let _uploadService = results.filter((result)=>result.name === _routes[type]);

                    //upload file 
                return _uploadService.length ?  UploadFile(req,res,type,_uploadService) : res.status(500).json({success:false, message:"service unavailable"});

                
            })
        };


        //if service unavailable
       


   });
//get available services
function getServices(_request,type,done){

    

    let services = {
        video:"$node.services",
        audio:"$node.services",
        image:"$node.services"
    }

    //check if type if valid

    if(!checkNodes(type,done)){
        return done("please provide valid type",false);
    };

    let service = services[type];

    if(typeof(_request) !== "object") throw TypeError(`expected request object but got ${typeof(_request)}`);

    if(typeof(type) !== "string") throw TypeError(`expected type string but got ${typeof(type)}`);
    
    
    _request.$ctx.broker.call(service)
        .then(res=>done(null,res))
            .catch(err=>done(err,false));

}
};



//route request to upload service
function UploadFile(req,res,type,instances){

    let {ip,port} = instances[0].settings;

    return req.pipe(request.post(`http://${ip}:${Number(port.toString().replace("5","3"))}/api/v1/uploads/${_resources[type]}?${req.url.split("?")[1]}&user=1234`).on("error",(err)=>console.log(err))).pipe(res).on("error",(error)=>console.log(error));
};

//confirm api token 
function sendIsDeveloperRequest(req,api_key,instances,done){

    let {ip,port} = instances[0].settings;

    return request.get(`http://${ip}:${Number(port.toString().replace("5","3"))}/api/v1/client/developers/apikey/isowner/?api_key=${api_key}`,{
        headers:{
            "Content-Type":"application/json",
            "authorization":req.headers["authorization"],
            "Accept":"application/json"
        }
    },function(error,response,body){
        
    let _httpRes;
        // console.log("error",error);
        // console.log("reponse",response.body);
        // console.log("body",body);
        if(error){
         
            return  done({success:false,message:"server may down or service unavailable due to zesco loadsheding",reason:null});
        }

        if(response){
            _httpRes = JSON.parse(response.body);
        }
        
        if(_httpRes && _httpRes.success === false){
          
            return done({success:false,message:_httpRes.message});
        }else if(_httpRes && _httpRes.success === true){
        
            return done(null,{success:true, payload:_httpRes.payload});
        }else{
            
            return done({success:false,message:"unkown error"})
        }

        
    });
};



//check if node handling upload is valid
function checkNodes(type,next){
    if(!type){
        return false
    };

    let AvailableNodes = {
        audio:"audio-uploads-service",
        image:"image-uplaods-service",
        video:"video-uploads-service"
    };

      
    if(AvailableNodes[type] === undefined){
        return false
    };

    return true;
}

