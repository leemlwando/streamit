const {parseUploads} = require("../lib");
module.exports = {
    service:{
        mixins:[],
        name:"audio-uploads",
        actions:{
            test(ctx){
                ctx.broker.call("$node.events").then(res => res);
            }
        },
        settings:{
            ip:"0.0.0.0",
            port:5090,
            use:[],
            routes:[
            ]
        }
    },
    broker:{
        namespace:"dev",
        nodeID:"audio-uploads-service",
        transporter:"redis"

    }
}