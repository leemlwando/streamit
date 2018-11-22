const {ServiceBroker} = require('moleculer');

const setup = {
    service:{
        mixins:[],
        name:"video-uploads",
        settings:{
            ip:"0.0.0.0",
            port:5040,
            use:[]
        }
    },
    _broker:{
        namespace:"dev",
        nodeID:"video-uploads-service",
        transporter:"redis"

    }
}
const broker = new ServiceBroker(setup._broker);

setup.broker = broker;
module.exports = setup;