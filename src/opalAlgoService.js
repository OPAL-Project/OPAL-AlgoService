// External node module imports
const mongodb = require('mongodb').MongoClient;
const express = require('express');
const body_parser = require('body-parser');
const { ErrorHelper, StatusHelper, Constants } =  require('eae-utils');
const { Constants_Opal } = require('opal-utils');

const package_json = require('../package.json');
const StatusController = require('./statusController.js');
const AlgoController = require('./algoController.js');


function OpalAlgoService(config) {
    // Initialize member attributes.
    this.config = config;
    this.app = express();
    global.opal_algoservice_config = config;

    // bind public member functions
    this.start = OpalAlgoService.prototype.start.bind(this);
    this.stop = OpalAlgoService.prototype.stop.bind(this);

    // bind private member functions
    this._connectDb = OpalAlgoService.prototype._connectDb.bind(this);
    this._setupStatusController = OpalAlgoService.prototype._setupStatusController.bind(this);

    // Remove unwanted express headers
    this.app.set('x-powered-by', false);

    // Allow CORS requests when enabled
    if (this.config.enableCors === true) {
        this.app.use(function (__unused__req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }
    // Init third party middleware
    this.app.use(body_parser.urlencoded({ extended: true }));
    this.app.use(body_parser.json());
}

/**
 * @fn start
 * @desc Start the server, by connecting with DB
 * @return {Promise} Resolves to express app if successful,
 * else rejects with an error stack
 */
OpalAlgoService.prototype.start = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._connectDb().then(function () {
            // Setup route using controllers
            _this._setupStatusController();
            _this._setupAlgoController();

            // Start status periodic update
            _this.status_helper.startPeriodicUpdate(5 * 1000); // Update status every 5 seconds

            resolve(_this.app); // All good, returns application
        }, function (error) {
            reject(ErrorHelper('Cannot establish mongoDB connection', error));
        });
    });
};

/**
 * @fn stop
 * @desc Stop the opal algoservice service
 * @return {Promise} Resolves to true on success,
 * rejects an error stack otherwise
 */
OpalAlgoService.prototype.stop = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        // Disconnect DB --force
        _this.db.close(true).then(function(error) {
            if (error)
                reject(ErrorHelper('Closing mongoDB connection failed', error));
            else
                resolve(true);
        });
    });
};

/**
 * @fn _connectDb
 * @desc Setup the connections with mongoDB
 * @return {Promise} Resolves to true on success
 * @private
 */
OpalAlgoService.prototype._connectDb = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        mongodb.connect(_this.config.mongoURL, {
            reconnectTries: 2000,
            reconnectInterval: 5000
        }, function (err, db) {
            if (err !== null && err !== undefined) {
                reject(ErrorHelper('Failed to connect to mongoDB', err));
            } else {
                _this.db = db;
                resolve(true);
            }
        });
    });
};

/**
 * @fn _setupStatusController
 * @desc Initialize status service routes and controller
 */
OpalAlgoService.prototype._setupStatusController = function () {
    let _this = this;

    let statusOpts = {
        version: package_json.version
    };
    _this.status_helper = new StatusHelper(Constants_Opal.OPAL_SERVICE_TYPE_ALGOSERVICE,
        global.opal_algoservice_config.port, null, statusOpts);
    _this.status_helper.setCollection(_this.db.collection(Constants.EAE_COLLECTION_STATUS));

    _this.statusController = new StatusController(_this.status_helper);
    _this.app.get('/status', _this.statusController.getStatus); // GET status
    _this.app.get('/specs', _this.statusController.getFullStatus); // GET Full status
};

/**
 * @fn _setupAlgoController
 * @desc Setting up routes for algorithm control
 * @private
 */
OpalAlgoService.prototype._setupAlgoController = function() {
    let _this = this;
    _this.algoController = new AlgoController(_this.db.collection(Constants_Opal.OPAL_ALGO_COLLECTION), _this.status_helper);
    _this.app.post('/add', _this.algoController.addAlgo); // POST new algorithm
    _this.app.put('/update', _this.algoController.updateAlgo); // UPDATE algorithm
    _this.app.get('/list', _this.algoController.listAlgo); // List all algorithms
    _this.app.get('/retrieve/:algoName([a-z0-9-]+)/:version([0-9]+)?/', _this.algoController.retrieveAlgo); // Retrieve algo
    _this.app.delete('/remove/:algoName([a-z0-9-]+)/:version([0-9]+)?/', _this.algoController.removeAlgo); // Remove algo
};

module.exports = OpalAlgoService;
