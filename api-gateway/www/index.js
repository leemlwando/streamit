const {app,broker} = require("../index");

//start application
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`server started on port ${port}`));

//start broker
broker.start();