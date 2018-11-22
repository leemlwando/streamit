const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    otherNames:[{type:String}],
    usernames:[],
    email:{
        confirmed:{type:Boolean, default:false},
        confirmationToken:{type:String},
        email: {type:String,required:true,unique:true}
    },
    phone_primary:{
        confirmed:{type:Boolean,default:false},
        phone:{type:String, required:true}
    },
    phone_secondary:[{
        confirmed:{type:Boolean,default:false},
        phone:{type:String}
    }],
    password:{type:String,required:true},
    interests:[{type:Schema.Types.ObjectId, ref:"Interests"}],
    location:{
        town:{type:String, required:true},
        province:{type:String, required:true},
        country:{type:String, required:true}
    },
    likes:[{type:Schema.Types.ObjectId, refPath:"Likes"}],
    comments:[{type:Schema.Types.ObjectId,refPath:"Comments"}],
    deleted:{type:Boolean,default:false},
    blocked:{type:Boolean,default:false},
    stars:{type:Number,min:0, max:5},
    level:{type:Number, min:1,max:10},
    role:{type:String,default:"client"}

});


const InterestSchema = new Schema({
    category:{type:String,required:true},
    genre:[{type:String,required:true}]
});



module.exports = {UserSchema,InterestSchema}