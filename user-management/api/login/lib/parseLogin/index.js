const {User} = require("../../../../lib").DB;
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (req,res,next)=>{
       //declare required fields
       let RequiredFields = ["username","password"];

       let missingFields = checkRequiredFields(req.body,RequiredFields);

       //check if any fields are mising
       if(missingFields.length){
           return next(createError(406,{message:missingFields}));
       };
   
       let {username,password} = req.body;

       let _username;

       //create a +260 prefix otherwsie we just assume its an email
       if(username.startsWith("+260") || username.startsWith("09") || username.startsWith("9")){
            _username = `+2609${username.slice(-8)}`;
            console.log(_username);
       }else{
           _username = username;
       }

       //search DB
       User.findOne({usernames:_username}).then(user=>{
           if(!user){
               return next(createError(404,{success:false,message:"No User Found"}));
           }

           let hash = user.password;
           //compare paswords
           bcrypt.compare(password,hash,function(err,isMatch){

               if(err){
                    return next(createError(404,{success:false,message:"operation not successfull"}));
               };

               if(!isMatch){
                return next(createError({success:false,message:"Passwords do not Match"}));
               };

               //sign token
                let _info = `${user.email.email}#$#${user._id}#$#${new Date()}` //email._id.timespamp

                //sign login token
                jwt.sign({_info},process.env.JWT_CLIENT_LOGIN_TOKEN,{ expiresIn: '7d' },function(err,token){
                    if(err){
                        return next(createError(404,{success:false,message:"operation not successful"}));
                    };

                    //send notification

                        //send response
                    return res.json({success:true, payload:{message:"operation successful",token}});

                });

           });
           //catch all other errors
       }).catch(err=>next(createError({code:err.code,success:false,message:"operation not succesful"})));
};


//find missing fields handler
function checkRequiredFields(body,RequiredFields){
    let missingFields;

    missingFields = RequiredFields.filter((element,index)=>{
        return body[element] === undefined;
    })
    return missingFields;
};