// Request Checker for List API
const RequestChecker = require('./requestChecker.js');

/**
 * @class ListRequestChecker
 * @desc Check whether List request is correct or not.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function ListRequestChecker(algoCollection) {
    RequestChecker.call(this, 'get', algoCollection);

    this.setupFieldCheckers = ListRequestChecker.prototype.setupFieldCheckers.bind(this);
}

ListRequestChecker.prototype = Object.create(ListRequestChecker.prototype); // Inheritance
ListRequestChecker.prototype.constructor = ListRequestChecker;

/**
 * @fn setupFieldCheckers
 * @desc Sets up the field checkers for each field.
 * @return {Map<any, any>}
 */
ListRequestChecker.prototype.setupFieldCheckers = function () {
    let fieldCheckerMap = new Map();
    return fieldCheckerMap;
};

module.exports = ListRequestChecker;
