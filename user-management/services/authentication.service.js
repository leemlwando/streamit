"use strict";
const Promise = require('bluebird');
const  {User} = require('../lib/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	name: "authentication",

	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service dependencies
	 */
	dependencies: [],	

	/**
	 * Actions
	 */
	actions: {

        /**
		 * login user
		 *
		 * @returns
		 */
		login(ctx) {
            let self = this;
            return Promise.resolve(ctx)
                        .then(ctx=>{
                            //check all fields are supplied
                            console.log("fields",ctx.params);
                            if(ctx.params.username ===undefined || ctx.params.password===undefined ){
                                return {status:401,success:false,message:"some fields missing"}
                            }
                           
                           let username = ctx.params.username.startsWith('+2609') ||ctx.params.username.startsWith('2609') || ctx.params.username.startsWith('09') || ctx.params.username.startsWith('9') ? '+260'+ctx.params.username.slice(-9) : ctx.params.username;
                           
                           const password = ctx.params.password;

                            return Promise.resolve(User.findOne({usernames:username}))
                                .then(user=>{
                                    if(!user){
                                        return {status:404,success:false,message:"user not found. please ensure user is registered or consult documentation for information"}
                                    }

                                    //compare passswords
                                    let hash = user.password;
                                    // console.log(hash,password, user)
                                    return Promise.resolve(bcrypt.compare(password,hash)).then(function(res){
                                        console.log(res)
                                        if(res===false){
                                            return {status:403,success:false,message:"passwords do not match"}
                                        }

                                        //sign token
                                         let token = jwt.sign({
                                            user_email:user.email
                                        },process.env.JWT_LOGIN_TOKEN,{ expiresIn: '7d' });
                                        
                                    //   return Promise.resolve(self.broker.call("authentication.loggedin",{email:user.email.email, name:user.firstName},{nodeID:"mail-service"}))
                                    //    .then(res=>{
                                    //         console.log(res)
                                    //         return {status:200,success:true,token:token,message:"user found succesfully"}
                                    //     }).catch(err=>{
                                    //         console.log(err)
                                    //        return {status:200,success:true,token:token,message:"user found succesfully",info:"mail service down"}
                                    //     })

                                    // self.broker.call("authentication.loggedin",{email:user.email.email, name:user.firstName},{nodeID:"mail-service"})

                                    return {status:200,success:true,token:token,message:"operation succesfully executed"}
                                    }).catch(err=>{
                                        // console.log(err)
                                        return {status:403,success:false,message:"could not authenticat user, please try again later"}
                                    })

                                   
                                }).catch(err=>{
                                    return {status:500,success:false,error:err}
                                })
                        }).catch(err=>{
                            // console.log(err)
                            return {status:500,success:false,error:err}
                        });
		},

		/**
		 * verify email
		 *
		 * @returns
		 */
		confirmemail(ctx) {
        // console.log(ctx.params)
            return Promise.resolve(ctx)
                        .then(ctx=>{
                            let login_token = ctx.params.login_token;
                            const verified = jwt.verify(login_token,process.env.JWT_LOGIN_TOKEN)
                            if(verified.user_email.confirmed===true){
                                return {status:401,success:false,message:"email already confirmed"}
                            }
                            return Promise.resolve(User.findOne({"email.email":verified.user_email.email})).then(user=>{
                                if(!user){
                                    return {status:403,success:false,message:"cannot verify token. please register or refer to doumentation for more information"}
                                }

                                if(user.email.confirmed === true){
                                    return {status:401,success:false,message:"email already confirmed"}
                                }

                                 user.email.confirmed = !user.email.confirmed //verify/change to true;

                                user.save(function(err){
                                     if(err){
                                         return {status:403,success:false,message:"could not update user. email not verified"}
                                     }


                                 })

                                 return {status:200,success:true,message:"email succesfully verified"}

                            }).catch(err=>{
                                console.log(err)
                                return {status:500,success:false,message:"an error occoured. could not verify token"}
                            })

                        }).catch(err=>{
                            console.log(err)
                            return {status:500,success:false,message:"could not verify token"}
                        });
        },

        resendconfirmemailtoken(ctx){
            let self = this;
            // console.log(ctx.params)
            return Promise.resolve(ctx)
                    .then(ctx=>{
                        let login_token = ctx.params.login_token
                       return Promise.resolve(self.broker.call("authentication.confirmlogintoken",{login_token}))
                            .then(res=>{
                                console.log('res',res)
                                if(res.success === false){
                                    return {status:403,success:false,message:"could not send verify login token."+res.message}
                                }

                         let login_token = jwt.sign({
                                user_email:res.email
                            },process.env.JWT_LOGIN_TOKEN,{ expiresIn: '7d' });

                            self.broker.call("authentication.confirmemail",{email:res.email.email,firstName:res.firstName,login_token},{nodeID:"mail-service"});
                            return {status:200,success:true,message:"email verification token resent"}
                            }).catch(err=>{
                                return {status:500,success:false,message:"failed to resend token"}
                            });
                    }).catch(err=>{
                        return {status:500,success:false,message:"failed to resend token"}
                    });
        },

        confirmlogintoken(ctx){
            let user;
            console.log(ctx.params.login_token)
            return Promise.resolve(ctx)
                        .then(ctx=>{
                            if(!ctx.params.login_token){
                                return {success:false,message:"please provide an authentication token"}
                            }
                            let payload = jwt.verify(ctx.params.login_token,process.env.JWT_LOGIN_TOKEN);
                            
                            return Promise.resolve(User.findOne({usernames:payload.user_email.email}))
                                .then(user=>{
                                    if(!user){
                                        return {status:404,success:false, message:"user not found"}
                                    }
                                    // if(user.email.confirmed === true){
                                    //     // return {status:403,success:false,message:"email already verified"}
                                    // }
                                    return {status:200,success:true,id:user._id};
                                }).catch(err=>{
                                    // console.log(err)
                                    return {status:500,success:false,message:"an error occoured"}
                                })
                        }).catch(err=>{
                            console.log(err)
                            return {
                                status:401,
                                success:false,
                                message:"please provide a valid token"}
                        })
        },

        //send reset password here

        forgotpassword(ctx){
            let self = this;
            return Promise.resolve(ctx)
                    .then(ctx=>{
                        let {reset_contact} = ctx.params;

                        return Promise.resolve(User.findOne({usernames:reset_contact}))
                                .then(user=>{
                                    if(!user){
                                        return {status:404,success:false, message:"user not found"}
                                    }

                                   let reset_token = jwt.sign({username:user.email.email},process.env.JWT_RESET_PASSWORD_SECRET, {expiresIn:"48h"});
                                   Promise.resolve( self.broker.call("authentication.sendresettoken",{
                                    reset_token,
                                    email:user.email.email,
                                    firstName:user.firstName
                                },{nodeID:"mail-service"}))
                                // .then(res=>{
                                    
                                   
                                //     return {status:200,success:true,message:"reset token succesfully sent"}
                                // }).catch(err=>{
                                //     return {status:500,success:false, message:"an error occoured while processing your request"}
                                // });

                                return {status:200,success:true,message:"reset token succesfully sent"}
                                }).catch(err=>{
                                    console.log(err)
                                    return {status:500,success:false,message:"some error occoured while processing your request, please try again later"}
                                })
                    }).catch(err=>{
                        console.log(err)
                        return {status:500,success:false,message:"an error occoured while processing your request, please try again some other time"}
                    })
        },

        resetpassword(ctx){
            return Promise.resolve(ctx)
                .then(ctx=>{
                    let {reset_password_token,password,confirm_password} = ctx.params;
                    let payload = jwt.verify(reset_password_token,process.env.JWT_RESET_PASSWORD_SECRET);
                    return Promise.resolve(bcrypt.hash(password,10)).then(function(hash){
                        return Promise.resolve(User.findOneAndUpdate({usernames:payload.username}, {password:hash}))
                            .then(user=>{
                                return {user, payload}
                            }).catch(err=>{
                                return {err:"error"}
                            })
                    }).catch(err=>{
                        return {err:"error"}
                    })
                    

                    
                }).catch(err=>{
                    return {status:500,success:false,message:"an error occoured, please try again later"}
                })
        },

        redirect(ctx){
            return {status:200,success:true,reset_token:ctx.params.reset_password_token}
        }

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};