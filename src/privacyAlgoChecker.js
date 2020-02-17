// Privacy Algorithm Python Script Checker
const { ErrorHelper } = require('eae-utils');
const FieldChecker = require('./fieldChecker.js');
const PythonCodeChecker = require('./pythonCodeChecker.js');

/**
 * @class PrivacyAlgoChecker
 * @desc Check if algorithm is correct and satisfies all limitations. Algorithm has two parts code and className.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function PrivacyAlgoChecker(algoCollection) {
    let fieldName = 'privacyAlgorithm';
    FieldChecker.call(this, fieldName, algoCollection);

    this._restrictedLibraries = [
        'multiprocessing'
    ];

    this._mustHaveLibraries = [
        'opalalgorithms'
    ];

    this._classNameRegex = new RegExp('^[A-Za-z0-9_]+$');
    this._baseClass = 'OPALPrivacy';

    this._pythonCodeChecker = new PythonCodeChecker();
    this._checkAll = PrivacyAlgoChecker.prototype._checkAll.bind(this);
    this._checkKey = PrivacyAlgoChecker.prototype._checkKey.bind(this);
}

PrivacyAlgoChecker.prototype = Object.create(FieldChecker.prototype); // Inheritance
PrivacyAlgoChecker.prototype.constructor = PrivacyAlgoChecker;

/**
 * @fn _checkAll
 * @desc Check if request has valid algorithm for all type of requests.
 * @param req Express.js request object
 * @return {Promise<any>}
 * @private
 */
PrivacyAlgoChecker.prototype._checkAll = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let algorithm = req.body ? req.body.privacyAlgorithm : undefined;
        if (algorithm !== null && algorithm !== undefined) {
            let promiseList = [];
            promiseList.push(_this._pythonCodeChecker.checkClassName(algorithm));
            promiseList.push(_this._pythonCodeChecker.checkCode(
                algorithm, _this._restrictedLibraries, _this._mustHaveLibraries, _this._baseClass));
            promiseList.push(_this._checkKey(algorithm));
            Promise.all(promiseList)
                .then(function (success) {
                    resolve(success);
                }, function (error) {
                    reject(ErrorHelper('Error in privacy algorithm.', error));
                });
        } else {
            resolve(true);
        }
    });
};

/**
 * @fn _checkKey
 * @desc Check if key mentioned is correct, must be same as in config file.
 * @param algorithm {JSON}
 * @return {Promise<any>} resolves with true, rejects with error.
 * @private
 */
PrivacyAlgoChecker.prototype._checkKey = function (algorithm) {
    return new Promise(function (resolve, reject){
        let key = algorithm ? algorithm.key : undefined;
        if (key === undefined || key === null) {
            reject(ErrorHelper('key not available'));
        } else {
            if (key === global.opal_algoservice_config.key) {
                resolve(true);
            } else {
                reject(ErrorHelper('invalid key.'));
            }
        }
    });
};

module.exports = PrivacyAlgoChecker;
