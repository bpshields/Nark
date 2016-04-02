'use strict';

// simple express server
var express = require('express');
var r = require("rethinkdb");
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var environment = process.env.NODE_ENV;
var config = require('./config/config.js');


if (environment === 'prod') {
    app.use(express.static(__dirname + '/../dist'));
} else {
    app.use('/', express.static(__dirname + '/../.tmp/serve'));
    app.use('/bower_components', express.static(__dirname + '/../bower_components'));
    app.use('/app', express.static(__dirname + '/../src/app'));
    app.use('/assets/images', express.static(__dirname + '/../src/assets/images'));
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

server.listen(3000);

//Initialize some databsae stuff upon server launching. Maybe we should stick this into a separate file/folder something
(function(){
    var connection = null;
    r.connect(config.db, function(err, conn) {
        if (err) throw err;
        connection = conn;
        
        app.locals.db_connection = connection;


        r.dbCreate('nark').run(connection, function(err, result) {
            if (err) {
                console.log("db already exists?: " + err);
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        });

        r.db('nark').tableCreate('services').run(connection, function(err, result) {
            if (err) {
                console.log("table already exists?: " + err);
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        });

        r.db('nark').table('services').changes().run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.each(function(err, row) {
                if (err) throw err;
                if (row && row.new_val) {
                    io.sockets.emit("people", row.new_val);
                    console.log(JSON.stringify(row, null, 2));
                    io.emit('chat message', JSON.stringify(row, null, 2));
                }
            });
        });
    })
})();