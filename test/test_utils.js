// Utilities for testing
const opalutils = require('opal-utils');
const fs = require('fs');
let config = require('../config/opal.algoservice.config.js');

/**
 * @class TestUtils
 * @desc Utilities to be used for testing.
 * @param testServer TestServer
 * @constructor
 */
function TestUtils(testServer) {
    this.ts = testServer;
    this.getPostData = TestUtils.prototype.getPostData.bind(this);
    this.getFileBase64 = TestUtils.prototype.getFileBase64.bind(this);
    this.emptyCollection = TestUtils.prototype.emptyCollection.bind(this);
}

/**
 * @fn getPostData
 * @desc Return data for Post request, replace the actual arguments if data is supplied.
 * @param data {JSON} JSON object that will have parameters that needs to be replaced, else defaults will be used.
 * @return {{algoName: string, description: string, algorithm: {code: string, className: string }}}
 */
TestUtils.prototype.getPostData = function (data) {
    let _this = this;
    data = data ? data : {};
    let filename = data.hasOwnProperty('filename') ? data.filename : 'test/algorithms/popDensity.py';
    let privacyFilename = data.hasOwnProperty('privacyFilename') ? data.privacyFilename : 'test/privacyalgorithms/density.py';
    return {
        algoName: data.hasOwnProperty('algoName') ? data.algoName : 'pop-density',
        description: data.hasOwnProperty('description') ? data.description : 'Population density',
        algorithm: {
            code: _this.getFileBase64(filename),
            className: data.hasOwnProperty('className') ? data.className : 'PopulationDensity',
            reducer: data.hasOwnProperty('reducer') ? data.reducer : opalutils.Constants_Opal.OPAL_AGGREGATION_METHOD_SUM
        },
        privacyAlgorithm: data.hasOwnProperty('privacyAlgorithm') ? data.privacyAlgorithm : {
            code: _this.getFileBase64(privacyFilename),
            className: 'Density',
            key: data.hasOwnProperty('key') ? data.key : config.key
        }
    };
};

/**
 * @fn getFileBase64
 * @desc Read file in base64 string.
 * @param filepath
 * @return {string}
 */
TestUtils.prototype.getFileBase64 = function (filepath) {
    let data = fs.readFileSync(filepath, 'utf8');
    return new Buffer(data).toString('base64');
};

/**
 * @fn createFreshDb
 * @desc Empties collection.
 * @return {Promise<any>}
 */
TestUtils.prototype.emptyCollection = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this.ts.mongo().listCollections({name: opalutils.Constants_Opal.OPAL_ALGO_COLLECTION}).toArray().then(
            function(items) {
                if (items.length > 0) {
                    _this.ts.mongo().collection(opalutils.Constants_Opal.OPAL_ALGO_COLLECTION).deleteMany({}).then(
                        function (success) {
                            resolve(success);
                        }, function (error) {
                            reject(error);
                        });
                }
            }, function (error) {
                reject(error);
            });
    });
};

module.exports = TestUtils;
