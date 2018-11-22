const request = require("request");
const createError = require("http-errors");

module.exports = (req,res,next)=>{

    //set required fields
    let RequiredFields =["firstName","lastName","email","phone_primary","password","confirmPassword","town","province","country"];
    //check for required fields
    let missingFields = checkRequiredFields(req.body,RequiredFields);

    if(missingFields.length){
        return next(createError(406,{success:false,reason:"missing Fields", message:missingFields}));
    };
        
    const {firstName,
        lastName,
        otherNames,
        email,
        phone_primary,
        phone_secondary,
        location,
        password,
        confirmPassword,
        town,province,country
        } = req.body;

    let User = {firstName,
        lastName,
        otherNames,
        email,
        phone_primary,
        phone_secondary,
        location,
        password,
        confirmPassword,town,province,country};

    //get available services
    return GetServices(req,"$node.services",(err,services)=>{
        if(err){
            return next(createError({success:false,code:err.code,message:"service unavailable"}));
        };
        let _services;
        let isArray = Array.isArray(services);
        if(isArray){
            _services = services.filter((serv,i)=>{
            
                return serv.name ==="user-service"
            })
        }else{
            _services = services["user-service"] === undefined ? [] : services;
        }
        
        // return res.json({success:true,service:_services});
        return sendRequest(req,res,next,_services,User);
    });

   

 
}




   //make sure required fields re filled in
function checkRequiredFields(body,RequiredFields){
    let missingFields;

    missingFields = RequiredFields.filter((element,index)=>{
        return body[element] === undefined;
    })
    return missingFields
};


function GetServices(_request,service,done){
    _request.$ctx.broker.call(service)
    .then(res=>done(null,res))
        .catch(err=>done(err,false));
};

function sendRequest(_req,res,next,instances,User){
        
    console.log(instances)
    let {ip,port} = instances[0]  ? instances[0].settings : next(createError(503,{success:false,message:"service unavailable",date:new Date()}, {expose:true}));
    return request.post(`http://${ip}:${Number(port.toString().replace("5","3"))}/api/v1/auth/client/register`,{
        // headers:_req.headers,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify(User)},function(error,response,body){
        let _httpRes;
        // console.log("error",error);
        // console.log("reponse",response.body);
        // console.log("body",body);
        if(error){
            
            return next(createError(503,{success:false,message:"server may down or service unavailable due to zesco loadsheding",reason:null}));
            
        }

        if(response){
            _httpRes = JSON.parse(response.body);
        }
        
        if(_httpRes && _httpRes.success === false){
                return next(createError({success:false,code:_httpRes.code,message:_httpRes.message}));
            // return res.json({success:false,message:_httpRes.message});
        }else if(_httpRes && _httpRes.success === true){
        
            return res.json({success:true, payload:_httpRes.payload});
        }else{
            return next(createError(500,{success:false,message:"unkown error"}));
            // return res.json({success:false,message:"unkown error"})
        }
    });
}