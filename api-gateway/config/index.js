const { ServiceBroker } = require("moleculer");
const routes = require("../api");

const setup = {
	serviceConfig:_serviceConfig(), //internal service configurations
	brokerConfig:_brokerConfig() //internal broker configurations
};

function _startBroker(){return new ServiceBroker(setup.brokerConfig)}; //create broker instance

setup.broker = _startBroker(); //expose broker instance

module.exports = {setup};

//service configurations
function _serviceConfig(){
	return {
		mixins:[],
		settings:{
			port:5000,
			ip:"0.0.0.0",
			use:[routes] //middleware
		}
	}
}

//broker configurations
function _brokerConfig(){
	return  {
	namespace: "dev",
	nodeID: "api-gateway",

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
}
}