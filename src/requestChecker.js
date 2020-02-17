// Check if request is valid.
const { ErrorHelper } = require('eae-utils');

/**
 * @class RequestChecker
 * @desc Abstract class to check if a request is valid.
 * @param reqType {String} Type of request
 * @param algoCollection MongoDB collection
 * @constructor
 */
function RequestChecker(reqType, algoCollection) {
    this._reqType = reqType;
    this._algoCollection = algoCollection;

    this.setupFieldCheckers = RequestChecker.prototype.setupFieldCheckers.bind(this);
    this.setup = RequestChecker.prototype.setup.bind(this);
    this.checkRequest = RequestChecker.prototype.checkRequest.bind(this);
}

/**
 * @fn setupFieldCheckers
 * @desc This returns an array of functions which will be used to verify if all fields are present.
 * @returns {Map} Map of fieldName to functions of field checker.
 */
RequestChecker.prototype.setupFieldCheckers = function() {
    throw 'Pure method should be implemented in the child class';
};

/**
 * @fn setup
 * @desc Setup the request checker.
 */
RequestChecker.prototype.setup = function(){
    let _this = this;
    _this.fieldCheckersArray = this.setupFieldCheckers();
};

/**
 * @fn checkRequest
 * @desc Check if request is valid
 * @param req
 * @returns {Promise<any>} true if check is successful, else rejects with an error.
 */
RequestChecker.prototype.checkRequest = function (req) {
    let _this = this;

    return new Promise(function(resolve, reject){
        let checkPromises = [];
        for (const entry of _this.fieldCheckersArray.entries()){
            let fieldChecker;
            fieldChecker = entry[1];
            checkPromises.push(fieldChecker.check(req, _this._reqType));
        }
        Promise.all(checkPromises)
            .then(function(_unused__success){
                resolve(true);
            })
            .catch(function(error){
                reject(ErrorHelper('Field check failed', error));
            });
    });
};

module.exports = RequestChecker;
