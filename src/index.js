let express = require('express');
let os = require('os');
let app = express();

let config = require('../config/opal.algoservice.config.js');
let OpalAlgoService = require('./opalAlgoService.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

let options = Object.assign({}, config);
let algoservice = new OpalAlgoService(options);

algoservice.start().then(function(algoservice_router) {
    app.use(algoservice_router);
    app.listen(config.port, function (error) {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
}, function(error) {
    console.error(error); // eslint-disable-line no-console
});
