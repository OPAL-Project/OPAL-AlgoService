// Check if valid algorithm name
const { ErrorHelper } = require('eae-utils');
const FieldChecker = require('./fieldChecker.js');

/**
 * @class DescriptionChecker
 * @desc Algorithm description checker. Must be a string and not empty.
 * @param algoCollection MongoDB collection
 * @constructor
 */
function DescriptionChecker(algoCollection) {
    let fieldName = 'description';
    FieldChecker.call(this, fieldName, algoCollection);

    this._checkAll = DescriptionChecker.prototype._checkAll.bind(this);
}

DescriptionChecker.prototype = Object.create(FieldChecker.prototype); // Inheritance
DescriptionChecker.prototype.constructor = DescriptionChecker;

/**
 * @fn _checkAll
 * @desc Field check for all requests.
 * @param req Express.js request object.
 * @return {Promise}, returns true on success, else rejects with an error.
 * @private
 */
DescriptionChecker.prototype._checkAll = function (req) {
    return new Promise(function (resolve, reject){
        let description = req.body ? req.body.description : undefined;
        if (description === undefined) {
            reject(ErrorHelper('description not available'));
        } else {
            if (typeof description === 'string' && description !== '') {
                resolve(true);
            } else {
                reject(ErrorHelper('description must be non-empty string.'));
            }
        }
    });
};

module.exports = DescriptionChecker;
