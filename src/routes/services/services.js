var express = require('express');
var router = express.Router();
var r = require("rethinkdb");

// middleware that is specific to this router
// setting Content-Type for all of the responses
router.use(function timeLog(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// define the home page route
router.get('/services', function(req, res) {
    var conn = req.app.locals.db_connection;

    r.db('nark').table('services').run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result, null, 2));
        });
    });
});

module.exports = router;