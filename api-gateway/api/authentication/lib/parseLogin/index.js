    //required fields
    let fields =["username","password"];
    const request = require("request");
    const createError = require("http-errors");
    
    module.exports = (req,res,next)=>{
        
        const {username,password} = req.body;
    
    
        let missingFields = RequiredFields(req.body);
    
        if(missingFields.length){
            return next(createError(406,{success:false,message:"missing Fields", message:missingFields}));
            
        };
    
        let User = {username,password};
    
        //get available services
        return GetServices(req,"$node.services",(err,services)=>{
            if(err){
                return next(err);
            };
    
            let _services = services.filter((serv,i)=>{
                
                return serv.name ==="user-service"
            })
            // return res.json({success:true,service:_services});
            return sendRequest(req,res,next,_services,User);
        });
    
       
    
     
    }
    
    
    
    
       //make sure required fields re filled in
    function RequiredFields(body){
        let missingFields;
    
        missingFields = fields.filter((element,index)=>{
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
        _resources = {
            login:"login",
            register:"register",
            forgotPassword:"forgotpassword",
            confirmtoken:"confrmtoken"
        };
    
        
        let {ip,port} = instances[0]  ? instances[0].settings : next(createError(503,{success:false,message:"service unavailable",date:new Date()}, {expose:true}));
    
        return request.post(`http://${ip}:${Number(port.toString().replace("5","3"))}/api/v1/auth/client/login`,{
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
             
                return  next(createError(503,{success:false,message:"server may down or service unavailable due to zesco loadsheding",reason:null}));
            }
    
            if(response){
                _httpRes = JSON.parse(response.body);
            }
            
            if(_httpRes && _httpRes.success === false){
              
                return res.json({success:false,message:_httpRes.message});
            }else if(_httpRes && _httpRes.success === true){
            
                return res.json({success:true, payload:_httpRes.payload});
            }else{
                
                return res.json({success:false,message:"unkown error"})
            }
        })
    }