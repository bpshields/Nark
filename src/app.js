'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

var environment = process.env.NODE_ENV;

if (environment === 'prod') {
    app.use(express.static(__dirname + '/../dist'));
} else {
    app.use('/', express.static(__dirname + '/../.tmp/serve'));
    app.use('/bower_components', express.static(__dirname + '/../bower_components'));
    app.use('/app', express.static(__dirname + '/../src/app'));
    app.use('/assets/images', express.static(__dirname + '/../src/assets/images'));
}
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.listen(3000);