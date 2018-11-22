const {app,broker} = require("../index");

//start application
const port = process.env.PORT || 6040;
app.listen(port,()=>console.log(`server started on port ${port}`));

//start broker
broker.start();