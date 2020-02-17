const request = require('request');
const eaeutils = require('eae-utils');
const opalutils = require('opal-utils');
let config = require('../config/opal.algoservice.config.js');
const TestServer = require('./testserver.js');

let ts = new TestServer();
beforeAll(function() {
    return new Promise(function (resolve, reject) {
        ts.run().then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Service status IDLE', function(done) {
    expect.assertions(4);
    request(
        {
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/status',
            json: true
        },
        function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.status).toEqual(eaeutils.Constants.EAE_SERVICE_STATUS_IDLE);
            done();
        }
    );
});

test('Service specs', function(done) {
    expect.assertions(4);
    request(
        {
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/specs',
            json: true
        },
        function(error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.type).toEqual(opalutils.Constants_Opal.OPAL_SERVICE_TYPE_ALGOSERVICE);
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

