"use strict";
const Promise = require('bluebird');
const {User} = require('../lib/db');
const jwt = require('jsonwebtoken');
module.exports = {
	name: "user",

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
		 * create new user
		 *
		 * @returns
		 */
		add(ctx) {
			let self=this;
			let _fields;
			_fields = ctx.params;
			if(!_fields){
				return JSON.stringify({success:false,message:"please provide all required fields"});
			}
            return Promise.resolve(ctx)
                        .then(ctx=>{
                            let firstName = ctx.params.firstName;
                            let lastName = ctx.params.lastName;
                            let otherNames = ctx.params.otherNames;
                            let email = ctx.params.email;
                            let phone_primary = ctx.params.phone_primary;
                            let phone_secondary = ctx.params.phone_secondary;
                            let password = ctx.params.password
                            let town = ctx.params.location ? ctx.params.location.town : undefined;
                            let province = ctx.params.location ? ctx.params.location.province : undefined;
                            let country = ctx.params.location ? ctx.params.location.country : undefined;
                                //check for any missing fields
                            if((firstName || lastName || email || phone_primary || password || town || province || country) === undefined){
                                return {status:400,success:false,message:"some fields missing, please refer to the documentation for required fields"}
                            }
                                //resolve user
                            return Promise.resolve(User.create({
                                firstName,lastName,otherNames,email,phone_primary,phone_secondary,password,
                                location:{
                                    town,province,country
                                }
                            })).then(user=>{
                                if(!user){
                                    return {status:400,success:false,message:"user was not created, please refer to documentation for required fields"}
								}
								
								//send email verification
								 //sign token
								 let login_token = jwt.sign({
									user_email:user.email
								},process.env.JWT_LOGIN_TOKEN,{ expiresIn: '7d' });

								self.broker.call("authentication.confirmemail",{email:user.email.email,firstName:user.firstName,login_token},{nodeID:"mail-service"});

                                return {status:200,success:true,message:"user was successfully created", payload:user}
                            }).catch(err=>{
                                return {code:err.code,success:false,message:err.code && err.code.toString() === "11000" ? "User with that username already exists" : "server error"}
                            });

                        }).catch(err=>{
							console.log("error..",err)
                            return {status:500,success:false,message:"server error",service:"user service", error:err}
                        });
		},
		
		 /**
		 * remove user
		 *
		 * @returns
		 */
        
        /**
		 * remove user
		 *
		 * @returns
		 */
		remove() {
			return "remove user";
        },
        
        /**
		 * edit user details
		 *
		 * @returns
		 */
		edit() {
			return "edit user";
		},

		
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