module.exports = (req,params,done)=>{

    if(typeof(req) !=="object" || typeof(params) !== "object") throw new TypeError(`expected params of type object but got ${typeof(req)}`);

    if(typeof(params) !== "object") throw new TypeError(`expected params of type object but got ${typeof(params)}`);

    if(typeof(done) !== "function") throw new TypeError(`expected params of type function but got ${typeof(req)}`);

    req.$ctx.call(params.service || "default.service",params.params || {})
        .then(res=>done(null,res))
        .catch(err=>done(err.false));
}