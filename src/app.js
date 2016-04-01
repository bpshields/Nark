'use strict';

// simple express server
var express = require('express');
//var sockio = require("socket.io");
//var app = express();
var r = require("rethinkdb");
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    setInterval(function(){io.emit('init', { for: 'everyone' });},1000);
});

var environment = process.env.NODE_ENV;

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

app.get('/api/v1/service', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var connection = null;
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.table('people').run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.toArray(function(err, result) {
                if (err) throw err;
                res.send(JSON.stringify(result, null, 2));
            });
        });
    })
});

app.get('/api/v1/service2', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html><script src='/bower_components/socket.io-client/socket.io.js'></script><body>hello world</body><script>var socket = io();socket.on('chat message', function(msg){console.log(msg)});</script></html>");
    res.end();
});

server.listen(3000);

var test = function () {
    var connection = null;
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.db('test').tableCreate('people').run(connection, function(err, result) {
            if (err) {
                console.log("table already exists?: " + err);
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        });

        r.table('people').insert([
            { name: "William Adama", age: 30},
            { name: "Laura Roslin", age: 29 }
        ]).run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        })

        r.table('people').changes().run(connection, function(err, cursor) {
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
};

test();