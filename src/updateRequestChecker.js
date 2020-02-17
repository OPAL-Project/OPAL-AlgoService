// Checks post request
const RequestChecker = require('./requestChecker.js');
const AlgoNameChecker = require('./algoNameChecker.js');
const DescriptionChecker = require('./descriptionChecker.js');
const AlgoChecker = require('./algoChecker.js');
const PrivacyAlgoChecker = require('./privacyAlgoChecker.js');

/**
 * @class UpdateRequestChecker
 * @desc Check whether update request is correct or not.
 * @param algoCollection MongoDb collection
 * @constructor
 */
function UpdateRequestChecker(algoCollection) {
    RequestChecker.call(this, 'update', algoCollection);

    this.setupFieldCheckers = UpdateRequestChecker.prototype.setupFieldCheckers.bind(this);
}

UpdateRequestChecker.prototype = Object.create(UpdateRequestChecker.prototype); // Inheritance
UpdateRequestChecker.prototype.constructor = UpdateRequestChecker;

/**
 * @fn setupFieldCheckers
 * @desc Sets up the field checkers for each field.
 * @return {Map<any, any>}
 */
UpdateRequestChecker.prototype.setupFieldCheckers = function () {
    let _this = this;

    let fieldCheckerMap = new Map();
    let algoNameChecker = new AlgoNameChecker(_this._algoCollection);
    let descriptionChecker = new DescriptionChecker(_this._algoCollection);
    let algoChecker = new AlgoChecker(_this._algoCollection);
    let privacyAlgoChecker = new PrivacyAlgoChecker(_this._algoCollection);

    algoNameChecker.setup();
    descriptionChecker.setup();
    algoChecker.setup();
    privacyAlgoChecker.setup();

    fieldCheckerMap.set('algoName', algoNameChecker);
    fieldCheckerMap.set('description', descriptionChecker);
    fieldCheckerMap.set('algorithm', algoChecker);
    fieldCheckerMap.set('privacyAlgorithm', privacyAlgoChecker);
    return fieldCheckerMap;
};

module.exports = UpdateRequestChecker;
