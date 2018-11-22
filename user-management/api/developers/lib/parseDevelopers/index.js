const {User} = require("../../../../lib").DB;
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = (req,res,next)=>{
    
    //get authorization header
    let auth = req.headers["authorization"];
        //check for token
    if (auth && auth.startsWith("Bearer")) {
        let token = auth.slice(7);

        jwt.verify(token,process.env.JWT_CLIENT_LOGIN_TOKEN,function(err,payload){
            if(err){
                return next(createError(403,{code:403,success:false,message:"invalid authentication token"}));
            };
            
            //find user in database
            let _user = payload._info.split("#$#")[0] //payload._info = email#$#_id#$#date
          
            User.findOne({usernames:_user},function(err,user){
                if(err){
                    return next(createError({success:false,code:404,message:"Could Not Verify Token"}));
                };
                if(!user){
                    return next(createError(404,{success:false,code:404,message:"User Not Found"}));
                };

                //create developers token
                let _info = `client#$#${user.email.email}#$#${user._id}`; // client#$#email#$#_id
                jwt.sign({_info},process.env.JWT_CLIENT_DEVELOPERS_TOKEN,{ expiresIn: '7d' },function(err,token){
                    if(err){
                        return next(createError(500,{success:false,message:"Could Not Issue Token"}));
                    };

                    return res.json({success:true,payload:{message:"operation successfull",token, date:new Date()}});
                })
            })
        })

    }else{
        //create developers
        return res.json({success:false,auth})
    }
        

};