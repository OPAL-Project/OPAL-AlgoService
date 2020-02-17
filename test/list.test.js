// Test for list request.
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

test('List without adding should return empty array.', function (done) {
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + ts.config.port,
        uri: '/list',
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body.item.length == 0);
        done();
    });
});

test('List should return all the added algos with latest version number.', function (done) {
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
                method: 'POST',
                baseUrl: 'http://127.0.0.1:' + ts.config.port,
                uri: '/add',
                body: testUtils.getPostData({algoName: 'pop-den'}),
                json: true
            }, function(error, response, body) {
                if (error) {
                    done.fail(error.toString());
                }
                expect(response).toBeDefined();
                expect(response.statusCode).toEqual(200);
                request({
                    method: 'GET',
                    baseUrl: 'http://127.0.0.1:' + ts.config.port,
                    uri: '/list',
                    json: true
                }, function(error, response, body) {
                    if (error) {
                        done.fail(error.toString());
                    }
                    expect(response).toBeDefined();
                    expect(response.statusCode).toEqual(200);
                    expect(body.item.length == 2);
                    expect(body.item[0].version + body.item[1].version).toEqual(3);
                    done();
                });
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
