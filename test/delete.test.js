// Test for delete request.
const request = require('request');
const TestServer = require('./testserver.js');
const TestUtils = require('./test_utils.js');

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

test('Delete without adding should return 404.', function (done) {
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/remove/pop-den/',
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(404);
        done();
    });
});

test('Delete should remove algo with latest version number when not provided.', function (done) {
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
            method: 'PUT',
            baseUrl: 'http://127.0.0.1:' + ts.config.port,
            uri: '/update',
            body: testUtils.getPostData(),
            json: true
        }, function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            request({
                method: 'DELETE',
                baseUrl: 'http://127.0.0.1:' + ts.config.port,
                uri: '/remove/' + testUtils.getPostData().algoName,
                json: true
            }, function(error, response, body) {
                if (error) {
                    done.fail(error.toString());
                }
                expect(response).toBeDefined();
                expect(response.statusCode).toEqual(200);
                expect(body.item.version == 2);
                done();
            });
        });
    });
});

test('Delete should remove algo with version number provided.', function (done) {
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
            method: 'PUT',
            baseUrl: 'http://127.0.0.1:' + ts.config.port,
            uri: '/update',
            body: testUtils.getPostData(),
            json: true
        }, function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            request({
                method: 'DELETE',
                baseUrl: 'http://127.0.0.1:' + ts.config.port,
                uri: '/remove/' + testUtils.getPostData().algoName + '/1',
                json: true
            }, function(error, response, body) {
                if (error) {
                    done.fail(error.toString());
                }
                expect(response).toBeDefined();
                expect(response.statusCode).toEqual(200);
                expect(body.item.version == 1);
                done();
            });
        });
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
