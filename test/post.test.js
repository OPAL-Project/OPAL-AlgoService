// Test POST requests.
const request = require('request');
const TestServer = require('./testserver.js');
const TestUtils = require('./test_utils.js');
const fs = require('fs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // 20 seconds

let ts = new TestServer();
let testUtils = new TestUtils(ts);

beforeAll(function() {
    return new Promise(function (resolve, reject) {
        ts.run().then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

/**
 * @fn beforeEach
 * @desc Before each test, sanitize the DB collection.
 */
beforeEach(function () {
    return testUtils.emptyCollection();
});


test('Correct description, algoName and algorithm', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData(),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(fs.existsSync(body.item.ops[0].algorithm.code)).toBeTruthy();
        expect(fs.existsSync(body.item.ops[0].privacyAlgorithm.code)).toBeTruthy();
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        done();
    });
});


test('AlgoName with capital characters', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({algoName: 'pop-Density'}),
        json: true
        }, function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(400);
            done();
        });
});

test('AlgoName with special characters except hyphens', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({algoName: 'pop_density'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Already inserted algoName.', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData(),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        request({
            method: 'POST',
            baseUrl: 'http://127.0.0.1:' + ts.config.port,
            uri: '/add',
            body: testUtils.getPostData(),
            json: true
        }, function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(400);
            done();
        });
    });
});

test('Undefined description', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({description: undefined}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Numerical description', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({description: undefined}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Empty description', function(done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({description: ''}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Code with multiprocessing library', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({filename: 'test/algorithms/popDensityMulti.py'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Code not using opalalgorithms library', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({filename: 'test/algorithms/popDensityOpal.py'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Code with wrong class name', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({className: 'populationDensity'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Code with invalid reducer', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({reducer: 'reducer'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Code with no privacy function', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({privacyAlgorithm: null}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        done();
    });
});

test('Code with wrong key.', function (done) {
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/add',
        body: testUtils.getPostData({key: 'wrongkey'}),
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(400);
        done();
    });
});

afterAll(function() {
    return new Promise(function (resolve, reject) {
        ts.stop().then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});
