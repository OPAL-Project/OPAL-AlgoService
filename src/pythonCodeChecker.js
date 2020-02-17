// Algorithm Python Script Checker
const { ErrorHelper } = require('eae-utils');
const { Helpers } = require('opal-utils');

/**
 * @class PythonCodeChecker
 * @desc Check if algorithm is correct and satisfies all limitations. Algorithm has two parts code and className.
 * @constructor
 */
function PythonCodeChecker() {
    this._classNameRegex = new RegExp('^[A-Za-z0-9_]+$');

    this._removeComments = PythonCodeChecker.prototype._removeComments.bind(this);
    this._removeSingleLineComments = PythonCodeChecker.prototype._removeSingleLineComments.bind(this);
    this._removeMultiLineComments = PythonCodeChecker.prototype._removeMultiLineComments.bind(this);
    this._checkLibraries = PythonCodeChecker.prototype._checkLibraries.bind(this);
    this._checkRestrictedLibrary = PythonCodeChecker.prototype._checkRestrictedLibrary.bind(this);
    this._checkMustHaveLibrary = PythonCodeChecker.prototype._checkMustHaveLibrary.bind(this);
    this.checkClassName = PythonCodeChecker.prototype.checkClassName.bind(this);
    this.checkCode = PythonCodeChecker.prototype.checkCode.bind(this);
    this.checkClassExists = PythonCodeChecker.prototype.checkClassExists.bind(this);
}

/**
 * @fn checkClassName
 * @desc Check if it is a valid classname by checking against regex.
 * @param algorithm
 * @return {Promise<any>} resolves with className, rejects with an error.
 * @private
 */
PythonCodeChecker.prototype.checkClassName = function (algorithm) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let algoClassName = algorithm ? algorithm.className : undefined;
        if (algoClassName) {
            if (_this._classNameRegex.test(algoClassName)) {
                resolve(algoClassName);
            } else {
                reject(ErrorHelper('Invalid algorithm className. Only alphabets, numerals and underscore are valid characters.'));
            }
        } else {
            reject(ErrorHelper('algorithm className not available.'));
        }
    });
};

/**
 * @fn checkCode
 * @desc Check if code is valid, it must not use restricted libraries and must use must have libraries. Class must exist which uses passed className argument.
 * @param algorithm {JSON} JSON algorithm object, containing code and className
 * @param restrictedLibraries {Array} Array of libraries to be restricted in the code
 * @param mustHaveLibraries {Array} Array of libraries to must have in the code
 * @param baseClass {String} Base class of the className to be used
 * @return {Promise<any>} resolves with true, rejects with error.
 * @private
 */
PythonCodeChecker.prototype.checkCode = function (algorithm, restrictedLibraries, mustHaveLibraries, baseClass) {
    let _this = this;
    let algoClassName = algorithm.className;
    return new Promise(function(resolve, reject) {
        let algoCode = algorithm ? algorithm.code : undefined;
        if (algoCode) {
            let code = Helpers.ConvBase64ToUTF8(algoCode);
            code = _this._removeComments(code);
            _this._checkLibraries(code, restrictedLibraries, mustHaveLibraries)
                .then(function() {
                    _this.checkClassExists(code, algoClassName, baseClass)
                        .then(function (success) {
                            resolve(success);
                        },function (error) {
                            reject(ErrorHelper('Invalid code and className combination.', error));
                        });
                }, function (error) {
                    reject(ErrorHelper('Invalid code', error));
                });
        } else {
            reject(ErrorHelper('algorithm code not available.'));
        }
    });
};

/**
 * @fn _checkLibraries
 * @desc Check that in code string, restricted libraries are not present and must have libraries are present.
 * @param code {String} code string to be checked in.
 * @return {Promise<any>} resolves to true, rejects with error.
 * @private
 */
PythonCodeChecker.prototype._checkLibraries = function (code, restrictedLibraries, mustHaveLibraries) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let libraryPromisesList = [];
        restrictedLibraries.forEach(function (library){
            libraryPromisesList.push(_this._checkRestrictedLibrary(code, library));
        });
        mustHaveLibraries.forEach(function (library){
            libraryPromisesList.push(_this._checkMustHaveLibrary(code, library));
        });
        Promise.all(libraryPromisesList)
            .then(function (success) {
                    resolve(success);
                }, function(error) {
                    reject(ErrorHelper('Invalid library usage.', error));
                }
            );
    });
};

/**
 * @fn _checkRestrictedLibrary
 * @desc Checks if library is used or not using regex.
 * @param code {String} code to be checked.
 * @param library {String} library that needs to be checked for.
 * @return {Promise<any>} resolves to true, rejects with an error.
 * @private
 */
PythonCodeChecker.prototype._checkRestrictedLibrary = function (code, library) {
    let importRegex = new RegExp('import\\s+' + library);
    let fromRegex = new RegExp('from\\s+' + library);
    return new Promise(function (resolve, reject) {
        if (importRegex.test(code) || fromRegex.test(code)) {
            reject(ErrorHelper('algorithm code contains restricted library ' + library));
        } else {
            resolve(true);
        }
    });
};

/**
 * @fn _checkMustHaveLibrary
 * @desc Check that library must have been imported in the code.
 * @param code {String} code to be checked
 * @param library {String} library to be checked
 * @return {Promise<any>} resolves with true, rejects with an error
 * @private
 */
PythonCodeChecker.prototype._checkMustHaveLibrary = function (code, library) {
    let importRegex = new RegExp('import\\s+' + library);
    let fromRegex = new RegExp('from\\s+' + library);
    return new Promise(function (resolve, reject) {
        if (importRegex.test(code) || fromRegex.test(code)) {
            resolve(true);
        } else {
            reject(ErrorHelper('algorithm code does not contain must have library ' + library));
        }
    });
};

/**
 * @fn checkClassExists
 * @desc Check that class with className must be defined in the code and must be inherited from OPALAlgorithm
 * @param code {String} code to be checked
 * @param algoClassName {String} className to be checked for.
 * @return {Promise<any>} resolves with true, rejects with an error.
 * @private
 */
PythonCodeChecker.prototype.checkClassExists = function (code, algoClassName, baseClass) {
    let classNameRegex = new RegExp('class\\s+' + algoClassName + '\\s*\\((.*?)' + baseClass + '\\s*\\)');
    return new Promise(function (resolve, reject) {
        if (classNameRegex.test(code)) {
            resolve(true);
        } else {
            reject(ErrorHelper('class ' + algoClassName + ' with base class ' + baseClass + ' not found.'));
        }
    });
};

/**
 * @fn _removeComments
 * @desc Remove pythonic comments from the supplied code.
 * @param code {String} code from which comments are to be removed
 * @return {String} code without comments
 * @private
 */
PythonCodeChecker.prototype._removeComments = function (code) {
    let _this = this;
    code = _this._removeSingleLineComments(code);
    code = _this._removeMultiLineComments(code);
    return code;
};

/**
 * @fn _removeSingleLineComments
 * @desc Removes single line pythonic comments from the python code.
 * @param code {String} Python code.
 * @return {string} code with single line comments removed.
 * @private
 */
PythonCodeChecker.prototype._removeSingleLineComments = function (code) {
    return code.replace(/#(.*?)(?:\r\n|\r|\n)/g, '');
};

/**
 * @fn _removeMultiLineComments
 * @desc Removes pythonic block comments from the python code
 * @param code {string} Python code
 * @return {string} code with block comments removed.
 * @private
 */
PythonCodeChecker.prototype._removeMultiLineComments = function (code) {
    return code.replace(/(['"])\1\1(.*?)\1{3}/g, '');
};

module.exports = PythonCodeChecker;
