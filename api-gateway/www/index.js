const {app,broker} = require("../index");

const port = process.env.PORT || 3000; //set port
broker.start(); //start moleculer service
app.listen(port,()=>console.log(`API GATEWAY STARTED ON PORT ${port}`)); //start express server
