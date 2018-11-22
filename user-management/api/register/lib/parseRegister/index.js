const createError = require("http-errors");
const {User} = require("../../../../lib").DB;
const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    
    //declare required fields
    let RequiredFields = ["firstName","lastName","email","phone_primary","password","confirmPassword","town","province","country"];

    let missingFields = checkRequiredFields(req.body,RequiredFields);
    //check if any fields are mising
    if(missingFields.length){
        return next(createError(406,{message:missingFields}));
    };

    let {firstName,lastName,otherNames,email,phone_primary,phone_secondary,password,confirmPassword,town,province,country} = req.body;

    //check if passwords match
    if(password !== confirmPassword){
        return next(createError({success:false,message:"Passwords do not match"}));
    }
    
    //create user
    User.create({
        firstName,lastName,otherNames,email,phone_primary,phone_secondary,password,
        location:{
            town,province,country
        }
    }).then(user=>{
            //assert user was created
        if(!user){
            return next(createError({success:false, message:"operation not successful"}));
        }

        /**
         * USER SUCCESSFULLY CREATED
        */

        //create token for email confirmation
        let _info = `${user.email.email}.${user._id}.${new Date()}` //email._id.timespamp
        jwt.sign({_info:_info},process.env.JWT_LOGIN_TOKEN,{ expiresIn: '7d' },function(err,token){
            if(err){
               console.log(err);
            };

            //send confirm email token
            console.error("token",token);
        });

        return res.json({success:true,payload:{message:"operation successfull",user}});
    }).catch(err=>next(createError({code:err.code, message:"operation not successful"})));


}


//find missing fields handler
function checkRequiredFields(body,RequiredFields){
    let missingFields;

    missingFields = RequiredFields.filter((element,index)=>{
        return body[element] === undefined;
    })
    return missingFields;
};