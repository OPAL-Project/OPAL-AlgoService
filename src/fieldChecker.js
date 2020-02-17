// Abstract class for field checking
const { ErrorHelper } = require('eae-utils');

/**
 * @class FieldChecker
 * @desc Abstract class for checking fields of the request.
 * @param fieldName {String} name of the field
 * @param algoCollection MongoDb collection of algorithms
 * @constructor
 */
function FieldChecker(fieldName, algoCollection) {
    this._fieldName = fieldName;
    this._algoCollection = algoCollection;

    this._checkAll = undefined;
    this._possibleRequests = new Set(['get', 'post', 'update', 'delete']);

    this.check = FieldChecker.prototype.check.bind(this);
    this._checkGET = FieldChecker.prototype._checkGET.bind(this);
    this._checkPOST = FieldChecker.prototype._checkPOST.bind(this);
    this._checkUPDATE = FieldChecker.prototype._checkUPDATE.bind(this);
    this._checkDELETE = FieldChecker.prototype._checkDELETE.bind(this);
}

/**
 * @fn setup
 * @desc Setup the fieldChecker.
 */
FieldChecker.prototype.setup = function () {
    let _this = this;
    // map request type to function
    _this._checkerReq2FuncsMap = new Map();
    _this._checkerReq2FuncsMap.set('get', this._checkGET);
    _this._checkerReq2FuncsMap.set('post', this._checkPOST);
    _this._checkerReq2FuncsMap.set('update', this._checkUPDATE);
    _this._checkerReq2FuncsMap.set('delete', this._checkDELETE);
};

/**
 * @fn check
 * @param req Express.js request object
 * @param reqType {String} type of request
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 */
FieldChecker.prototype.check = function (req, reqType) {
    let _this = this;

    return new Promise(function (resolve, reject) {
        if (!(_this._possibleRequests.has(reqType))) {
            reject(ErrorHelper('Request type ' + reqType.toString() + ' not supported.'));
        }
        if (_this._checkAll !== undefined) {
            _this._checkAll(req)
                .then(function(success){
                    resolve(success);
                }, function(error){
                    reject(ErrorHelper('Invalid `' + _this._fieldName + '`.', error));
                });
        } else {
            _this._checkerReq2FuncsMap.get(reqType)(req)
                .then(function(success) {
                    resolve(success);
                }, function(error) {
                    reject(ErrorHelper('Invalid `' + _this._fieldName + '`.', error));
                });
        }
    });
};

/**
 * @fn _checkGET
 * @desc Check the field when supplied with a GET request.
 * @param req Express.js request object
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 * @private
 * @pure
 */
FieldChecker.prototype._checkGET = function (_unused__req) {
    let _this = this;
    throw 'Check field for GET request for the field ' + _this._fieldName + ' must be implemented in child class';
};

/**
 * @fn _checkPOST
 * @desc Check the field when supplied with a POST request.
 * @param req Express.js request object
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 * @private
 * @pure
 */
FieldChecker.prototype._checkPOST = function (_unused__req) {
    let _this = this;
    throw 'Check field for POST request for the field ' + _this._fieldName + ' must be implemented in child class';
};

/**
 * @fn _checkUPDATE
 * @desc Check the field when supplied with a UPDATE request.
 * @param req Express.js request object
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 * @private
 * @pure
 */
FieldChecker.prototype._checkUPDATE = function (_unused__req) {
    let _this = this;
    throw 'Check field for UPDATE request for the field ' + _this._fieldName + ' must be implemented in child class';
};

/**
 * @fn _checkDELETE
 * @desc Check the field when supplied with a DELETE request.
 * @param req Express.js request object
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 * @private
 * @pure
 */
FieldChecker.prototype._checkDELETE = function (_unused__req) {
    let _this = this;
    throw 'Check field for DELETE request for the field ' + _this._fieldName + ' must be implemented in child class';
};

module.exports = FieldChecker;
