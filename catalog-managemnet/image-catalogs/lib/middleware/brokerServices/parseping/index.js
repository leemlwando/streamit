module.exports = (req,params,done)=>{

        req === undefined || params ===undefined ? new Error("please provide valid parameters") : false;

        if(typeof(req) !=="object" || typeof(params) !== "object") throw new TypeError(`expected params of type object but got ${typeof(req)}`);

        if(typeof(params) !== "object") throw new TypeError(`expected params of type object but got ${typeof(params)}`);

        if(typeof(done) !== "function") throw new TypeError(`expected params of type function but got ${typeof(req)}`);

        req.$ctx.broker.ping(params.service || "default.service")
            .then(res=>done(null,res)).catch(err=>done(err,false));


}