const { ServiceBroker } = require("moleculer");
const {ErrorMessages} = require("../lib");
const createError = require('http-errors');

const setup = {};

//create service configurations
setup.serviceConfig = {
    mixins: [],
	name:"video-catalogs",
    settings: {
        // Exposed port
        port: 5040,

        // Exposed IP
        ip: "0.0.0.0",
        use:[
            
        ]
    }
};

//setup broker configurations
setup.brokerConfig = {
    namespace: "dev",
	nodeID: "video-catalogs-service",

	logger: true,
	logLevel: "info",
	logFormatter: "default",
	logObjectPrinter: null,

	transporter: "Redis",

	cacher: "Redis",

	serializer: "JSON",

	requestTimeout: 10 * 1000,
	retryPolicy: {
		enabled: false,
		retries: 5,
		delay: 100,
		maxDelay: 1000,
		factor: 2,
		check: err => err && !!err.retryable
	},

	maxCallLevel: 100,
	heartbeatInterval: 5,
	heartbeatTimeout: 15,

	tracking: {
		enabled: false,
		shutdownTimeout: 5000,
	},

	disableBalancer: false,

	registry: {
		strategy: "RoundRobin",
		preferLocal: true
	},

	circuitBreaker: {
		enabled: false,
		threshold: 0.5,
		windowTime: 60,
		minRequestCount: 20,
		halfOpenTime: 10 * 1000,
		check: err => err && err.code >= 500
	},

	bulkhead: {
		enabled: false,
		concurrency: 10,
		maxQueueSize: 100,
	},

	validation: true,
	validator: null,

	metrics: false,
	metricsRate: 1,

	internalServices: true,
	internalMiddlewares: true,

	hotReload: false,

	// Register custom middlewares
	middlewares: [],

	// Called after broker created.
	created(broker) {
		
	},

	// Called after broker starte.
	started(broker) {

	},

	// Called after broker stopped.
	stopped(broker) {

	},

	replCommands: null

};

//create broker instance
setup.broker = new ServiceBroker(setup.brokerConfig);

//catch 404 errors
setup.catch404 = function(req,res,next){
    next(createError(404, {}, {success:false, code:404}))
};

//handle errors
setup.errorHandler = function(err,req,res,next){
	let _error = ErrorMessages(err);
	let error = {};
    let availableCodes = [401,404,403,500,503,406];
	let defaultCode = 500;
	let code = err.code && availableCodes.includes(Number(err.code)) ? err.code : defaultCode;
        //give json response for api queries
    if(req.path.startsWith("/api")){
	
        res.status(code);

        //return error
        return res.json({
			status:code,
            success:false,
            message:_error,
            reason:err.message || "Please Refer to documentation",
            date: new Date(),
            documentation:"https://github.com/leemlwando/streamit"
        });
    };
	error.code = code;
	error.message = _error;
    res.locals.error = error; //create global error object
    res.status(code); //set status code
    res.render("errors/index"); //render custom error page
}



module.exports = setup;