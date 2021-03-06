'use strict';

// simple express server
var express = require('express');
var r = require("rethinkdb");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var environment = process.env.NODE_ENV;
var config = require('./config/config.js');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );


if (environment === 'prod') {
    app.use(express.static(__dirname + '/../dist'));
} else {
    app.use('/', express.static(__dirname + '/../../.tmp/serve'));
    app.use('/bower_components', express.static(__dirname + '/../../bower_components'));
    app.use('/app', express.static(__dirname + '/../../src/client/app'));
    app.use('/assets/images', express.static(__dirname + '/../../src/client/assets/images'));
}

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var services = require('./routes/services/services.js');
app.use('/api/v1', services)


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    setInterval(function(){io.emit('init', { for: 'everyone' });},1000);
});

// TODO: Separate to separate file for initializing database connection, db, and tables.
server.listen(3000, function(){
    var connection = null;
    r.connect(config.db, function(err, conn) {
        if (err) throw err;
        connection = conn;

        app.locals.db_connection = connection;

        /**
         * Function for creating a table and calling watch changes function when finished.
         */
        function createTable() {
            r.db('nark').tableCreate('services').run(connection)
                .then(function(result) {
                    console.log(JSON.stringify(result, null, 2));
                })
                .catch(function() {})
                .finally(watchChanges);
        }

        /**
         * Function for starting to watch the changes of the services table.
         */
        function watchChanges() {
            r.db('nark').table('services').changes().run(connection)
                .then(function(cursor) {
                    cursor.each(function(err, row) {
                        if (err) throw err;
                        if (row && row.new_val) {
                            io.sockets.emit("Services:Update", row);
                        }
                    });
                })
                .catch(function() {});
        }

        // create database if necessary
        r.dbCreate('nark').run(connection)
            .then(function(result) {
                console.log(JSON.stringify(result, null, 2));
            })
            .catch(function() {})
            .finally(createTable);
    })
});