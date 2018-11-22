const mongoose = require('mongoose');
const {InterestSchema} = require('../schema');
const {UserSchema} = require('../methods');


const User = mongoose.model('Users',UserSchema);

const Interests = mongoose.model('Interests',InterestSchema);


module.exports = {User,Interests}