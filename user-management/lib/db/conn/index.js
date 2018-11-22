const mongoose = require('mongoose');

// mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-vsuza.mongodb.net/${process.env.DB_NAME}?retryWrites=true`);

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_HOST}/${process.env.DB_NAME}`,{useNewUrlParser:true});

const db = mongoose.connection;

db.on('open',()=>console.log('database connected'));
db.on('error',(err)=>console.log(err))


module.exports = db;