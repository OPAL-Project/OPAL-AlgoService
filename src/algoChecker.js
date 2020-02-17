// Algorithm Python Script Checker
const { ErrorHelper } = require('eae-utils');
const { Constants_Opal } = require('opal-utils');
const FieldChecker = require('./fieldChecker.js');
const PythonCodeChecker = require('./pythonCodeChecker.js');

/**
 * @class AlgoChecker
 * @desc Check if algorithm is correct and satisfies all limitations. Algorithm has two parts code and className.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function AlgoChecker(algoCollection) {
    let fieldName = 'algorithm';
    FieldChecker.call(this, fieldName, algoCollection);

    this._restrictedLibraries = [
        'multiprocessing'
    ];

    this._mustHaveLibraries = [
        'opalalgorithms'
    ];

    this._classNameRegex = new RegExp('^[A-Za-z0-9_]+$');
    this._baseClass = 'OPALAlgorithm';

    this._reducerMethods = [
        Constants_Opal.OPAL_AGGREGATION_METHOD_COUNT,
        Constants_Opal.OPAL_AGGREGATION_METHOD_SUM
    ];

    this._pythonCodeChecker = new PythonCodeChecker();
    this._checkAll = AlgoChecker.prototype._checkAll.bind(this);
    this._checkReducer = AlgoChecker.prototype._checkReducer.bind(this);
}

AlgoChecker.prototype = Object.create(FieldChecker.prototype); // Inheritance
AlgoChecker.prototype.constructor = AlgoChecker;

/**
 * @fn _checkAll
 * @desc Check if request has valid algorithm for all type of requests.
 * @param req Express.js request object
 * @return {Promise<any>}
 * @private
 */
AlgoChecker.prototype._checkAll = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let algorithm = req.body ? req.body.algorithm : undefined;
        if (algorithm) {
            let promiseList = [];
            promiseList.push(_this._pythonCodeChecker.checkClassName(algorithm));
            promiseList.push(_this._pythonCodeChecker.checkCode(
                algorithm, _this._restrictedLibraries, _this._mustHaveLibraries, _this._baseClass));
            promiseList.push(_this._checkReducer(algorithm));
            Promise.all(promiseList)
                .then(function (success) {
                    resolve(success);
                }, function (error) {
                    reject(ErrorHelper('Error in algorithm.', error));
                });
        } else {
            reject(ErrorHelper('algorithm not available.'));
        }

    });
};

/**
 * @fn _checkReducer
 * @desc Check if reducer mentioned is correct, must be amongst valid choices.
 * @param algorithm {JSON}
 * @return {Promise<any>} resolves with true, rejects with error.
 * @private
 */
AlgoChecker.prototype._checkReducer = function (algorithm) {
    let _this = this;
    return new Promise(function (resolve, reject){
        let reducer = algorithm ? algorithm.reducer : undefined;
        if (reducer === undefined) {
            reject(ErrorHelper('reducer not available'));
        } else {
            if (_this._reducerMethods.includes(reducer)) {
                resolve(true);
            } else {
                reject(ErrorHelper('reducer must be from ' + _this._reducerMethods.toString()));
            }
        }
    });
};


module.exports = AlgoChecker;
