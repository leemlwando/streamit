const {UserSchema} = require('../schema');
const bcrypt = require('bcrypt');

UserSchema.pre('save',function(next){
    let self = this;
    let password  =self.password;
    let salt = 10;
    //hash password
    bcrypt.hash(password,salt,function(err,hash){
        if(err){return next(err)}
        self.password = hash;

            //ensure phone number is saved correctly. some clients are stupid!
        let phone_prefix = "+260"
        self.phone_primary.phone = phone_prefix+self.phone_primary.phone.slice(-9);

        //add usernames
        self.usernames.push(self.email.email); //add email as username;
        self.usernames.push(self.phone_primary.phone) //add phone number as username
         
        next()
    })

     
  

})



module.exports = {UserSchema}