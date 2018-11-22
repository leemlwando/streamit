
const createError = require('http-errors');
const request = require('request');
const assert = require("assert");
let port = 3020;
let host = "127.0.0.1";
const authourization = (req,res,next)=>{

    // console.log(req);





    let auth = req.headers["authorization"];
  
    if(req.path.startsWith("/api/v1/streaming/video")){
       
       return next();
    }
   

    if (auth && auth.startsWith("Bearer")) {
        let token = auth.slice(7);

        request(`http://${host}:${port}/api/v1/authentication/confirmlogintoken?login_token=${token}`, function (error, response, body) {
           
        if(error){
            return next(createError({code:error.code.toString() === "ECONNREFUSED" ? 402 : 500,message:error.code.toString() === "ECONNREFUSED" ? "service unavailable, if you think this is a problem with our api service, please send the issue to leemlwando@gmail.com" : "Ooops!! Something went wrong"}));
        }
            if(!body){
                return next(createError(500,{code:500,message:"service unavailable. please report this problem to leemlwando@gmail.com"}));
            }
          

            let success = body ? JSON.parse(body).success : false;
            // console.log(body)

            //check success;
            switch(success){
                case true:
                    req._id = JSON.parse(body).id;
                    next();
                    break;
                default:
                    let r = JSON.parse(body);

                    next(createError(403,{message:r ? r.message : "could not authenticate user. Please provide a valid token, or call customer care service for assistance "}));
            }

            

            

        });

    } else {
        // No token
        return next(createError(403));
    }
}


module.exports = (req,res,next)=>{
    console.log(req.path)
    switch(req.path){
        case '/api/v1/auth/login':
            next();
            break;
        case '/api/v1/auth/register':
            next();
            break;
        case '/':
            next();
            break;
        case '/api/v1':
            next();
            break;
        case "/api/v1/streaming/video":
            next();
            break;
        case "/api/v1/streaming/images":
            next();
            break;
        case "/api/v1/streaming/audio":
            next();
            break;
        default:
            return authourization(req,res,next);
    }
}