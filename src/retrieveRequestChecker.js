// Check whether retrieve request is valid or not.
const RequestChecker = require('./requestChecker.js');
const AlgoNameChecker = require('./algoNameChecker.js');

/**
 * @class RetrieveRequestChecker
 * @desc Check whether Retrieve request is correct or not.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function RetrieveRequestChecker(algoCollection) {
    RequestChecker.call(this, 'get', algoCollection);

    this.setupFieldCheckers = RetrieveRequestChecker.prototype.setupFieldCheckers.bind(this);
}

RetrieveRequestChecker.prototype = Object.create(RetrieveRequestChecker.prototype); // Inheritance
RetrieveRequestChecker.prototype.constructor = RetrieveRequestChecker;

/**
 * @fn setupFieldCheckers
 * @desc Sets up the field checkers for each field.
 * @return {Map<any, any>}
 */
RetrieveRequestChecker.prototype.setupFieldCheckers = function () {
    let _this = this;
    let fieldCheckerMap = new Map();

    let algoNameChecker = new AlgoNameChecker(_this._algoCollection);
    algoNameChecker.setup();

    fieldCheckerMap.set('algoName', algoNameChecker);
    return fieldCheckerMap;
};

module.exports = RetrieveRequestChecker;

