// Checker for delete request.
const RequestChecker = require('./requestChecker.js');
const AlgoNameChecker = require('./algoNameChecker.js');

/**
 * @class DeleteRequestChecker
 * @desc Check whether Retrieve request is correct or not.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function DeleteRequestChecker(algoCollection) {
    RequestChecker.call(this, 'delete', algoCollection);

    this.setupFieldCheckers = DeleteRequestChecker.prototype.setupFieldCheckers.bind(this);
}

DeleteRequestChecker.prototype = Object.create(DeleteRequestChecker.prototype); // Inheritance
DeleteRequestChecker.prototype.constructor = DeleteRequestChecker;

/**
 * @fn setupFieldCheckers
 * @desc Sets up the field checkers for each field.
 * @return {Map<any, any>}
 */
DeleteRequestChecker.prototype.setupFieldCheckers = function () {
    let _this = this;
    let fieldCheckerMap = new Map();

    let algoNameChecker = new AlgoNameChecker(_this._algoCollection);
    algoNameChecker.setup();

    fieldCheckerMap.set('algoName', algoNameChecker);
    return fieldCheckerMap;
};

module.exports = DeleteRequestChecker;


