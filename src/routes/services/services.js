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
    r.db('nark').table('services').run(req.app.locals.db_connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});


//Required Properties: Host,Path,Type,PrefResponseTime,PrefStatusCode,PrefResponseData
//TODO: Refactor this in the morning and actually put more thought into validation
router.post('/services/create', function(req, res) {
    var service = req.body;
    var response = null;
    if ( validateBody(service) ) {
        r.db('nark').table('services').insert(service).run(req.app.locals.db_connection, function(err, result) {
            if (err) {
                res.status(500);
                response = err;
            }
            response = result;
        })
        res.status(200);
    }
    res.json(response);
});

function validateBody(body) {
    var valid = true;
    console.log(body);
    return valid;
}


module.exports = router;