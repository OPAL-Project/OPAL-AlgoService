// Check if valid algorithm name
const { ErrorHelper } = require('eae-utils');
const FieldChecker = require('./fieldChecker.js');

/**
 * @class AlgoNameChecker
 * @desc Algorithm Name checker. This field must be contain only lowercase alphabets, numerals and hyphens.
 * @param algoCollection MongoDB collection
 * @constructor
 */
function AlgoNameChecker(algoCollection) {
    let fieldName = 'algoName';
    FieldChecker.call(this, fieldName, algoCollection);

    this._checkPOST = AlgoNameChecker.prototype._checkPOST.bind(this);
    this._checkUPDATE = AlgoNameChecker.prototype._checkUPDATE.bind(this);
    this._checkGET = AlgoNameChecker.prototype._checkGET.bind(this);
    this._checkDELETE = AlgoNameChecker.prototype._checkDELETE.bind(this);

    this._checkExist = AlgoNameChecker.prototype._checkExist.bind(this);
    this.regexp = new RegExp('^[a-z0-9-]+$');
}

AlgoNameChecker.prototype = Object.create(FieldChecker.prototype); // Inheritance
AlgoNameChecker.prototype.constructor = AlgoNameChecker;

/**
 * @fn _checkPOST
 * @desc Field check for post requests. Regex matching and must not exist in DB.
 * @param req Express.js request object.
 * @return {Promise}, returns true on success, else rejects with an error.
 * @private
 */
AlgoNameChecker.prototype._checkPOST = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject){
        let algoName = req.body ? req.body.algoName : undefined;
        if (algoName === undefined) {
            reject(ErrorHelper('algoName not available'));
        } else{
            if (_this.regexp.test(algoName)) {
                _this._algoCollection.count({'algoName': algoName}, function (err, count) {
                    if (err){
                        reject(ErrorHelper('Error in db', err));
                    } else {
                        if (count == 0) {
                            resolve(true);
                        } else {
                            reject(ErrorHelper('algoName `' + algoName + '` already exists in DB. Use /update to update the algorithm'));
                        }
                    }
                });
            } else {
                reject(ErrorHelper('algoName must contain only lower case alphabets, numerals and hyphens.'));
            }
        }
    });
};


/**
 * @fn _checkUPDATE
 * @desc Field Check for update request. Check already exists in DB.
 * @param req Express.js request object.
 * @return {Promise<any>} resolves with true on success, rejects with an error.
 * @private
 */
AlgoNameChecker.prototype._checkUPDATE = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject){
        let algoName = req.body ? req.body.algoName : undefined;
        if (algoName === undefined) {
            reject(ErrorHelper('algoName not available'));
        } else {
            _this._checkExist(algoName).then(
                function (success) { resolve(success);},
                function (error) { reject(error);});
        }
    });
};

/**
 * @fn _checkExist
 * @desc Check if algoName exists in the database
 * @param algoName {string}
 * @return {Promise<any>} resolves with true, rejects with an error.
 * @private
 */
AlgoNameChecker.prototype._checkExist = function(algoName) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._algoCollection.count({'algoName': algoName}, function (err, count) {
            if (count == 0) {
                reject(ErrorHelper('algoName `' + algoName + '` does not exist in DB. Use /add to add the algorithm'));
            } else {
                resolve(true);
            }
        });
    });
};

/**
 * @fn _checkGET
 * @desc Field Check for get request. Check already exists in DB.
 * @param req Express.js request object.
 * @return {Promise<any>} resolves with true on success, rejects with an error.
 * @private
 */
AlgoNameChecker.prototype._checkGET = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject){
        let algoName = req.params ? req.params.algoName : undefined;
        if (algoName === undefined) {
            reject(ErrorHelper('algoName not available'));
        } else {
            _this._algoCollection.count({'algoName': algoName}, function (err, count) {
                if (count == 0) {
                    reject(ErrorHelper('algoName `' + algoName + '` does not exist in DB. Use /add to add the algorithm'));
                } else {
                    resolve(true);
                }
            });
        }
    });
};

/**
 * @fn _checkDELETE
 * @desc Field Check for delete request. Check already exists in DB.
 * @param req Express.js request object.
 * @return {Promise<any>} resolves with true on success, rejects with an error.
 * @private
 */
AlgoNameChecker.prototype._checkDELETE = function (req) {
    let _this = this;
    return new Promise(function (resolve, reject){
        let algoName = req.params ? req.params.algoName : undefined;
        if (algoName === undefined) {
            reject(ErrorHelper('algoName not available'));
        } else {
            _this._algoCollection.count({'algoName': algoName}, function (err, count) {
                if (count == 0) {
                    reject(ErrorHelper('algoName `' + algoName + '` does not exist in DB. Use /add to add the algorithm'));
                } else {
                    resolve(true);
                }
            });
        }
    });
};

module.exports = AlgoNameChecker;
