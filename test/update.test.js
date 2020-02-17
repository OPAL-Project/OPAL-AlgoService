// Test for update request.
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

test('Update without adding should not work', function (done) {
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
        expect(response.statusCode).toEqual(400);
        done();
    });
});

test('Update after adding should work and have both files must have version names separated by 1.', function (done) {
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
        let v1path = body.item.ops[0].algorithm.code;
        let v1 = body.item.ops[0].version;
        expect(fs.existsSync(v1path)).toBeTruthy();
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
            let v2path = body.item.ops[0].algorithm.code;
            let v2 = body.item.ops[0].version;
            expect(v2-v1).toEqual(1);
            expect(fs.existsSync(v2path)).toBeTruthy();
            expect(v1path === v2path).toBeFalsy();
            done();
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
