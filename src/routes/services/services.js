var express = require('express');
var router = express.Router();
var r = require("rethinkdb");

//TODO: Mask error messages as they expose too much data to users (table names, etc)

// middleware that is specific to this router
// setting Content-Type for all of the responses
router.use(function timeLog(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

router.get('/services', function(req, res) {
    r.db('nark').table('services').run(req.app.locals.db_connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

router.get('/services/:id', function(req, res) {
    var response = null;

    //If Validation passes lets insert the service into the database
    r.db('nark').table('services').get(req.params.id).run(req.app.locals.db_connection, function(err, result) {
        if (err) {
            res.status(500);
            response = err;
        } else {
            res.status(200);
            response = result;
        }
        res.json(response);
    })
});


//Required Properties: Host,Path,Type,PrefResponseTime,PrefStatusCode,PrefResponseData
router.post('/services/create', function(req, res) {
    var service = req.body;
    var response = null;

    //Validate required parameters
    if ( !service.hostname ) {response = {"ErrorMessage": "Invalid hostname"}; res.status(500); res.json(response);}
    if ( !service.path ) {response = {"ErrorMessage": "Invalid path"}; res.status(500); res.json(response);}
    if ( !service.method ) {response = {"ErrorMessage": "Invalid method"}; res.status(500); res.json(response);}


    //If Validation passes lets insert the service into the database
    r.db('nark').table('services').insert(service).run(req.app.locals.db_connection, function(err, result) {
        if (err) {
            res.status(500);
            response = err;
        } else {
            res.status(200);
            response = result;
        }
        res.json(response);
    })
});

//GET DELETE
router.get('/services/delete/:id', function(req, res) {
    var response = null;

    //If Validation passes lets insert the service into the database
    r.db('nark').table('services').get(req.params.id).delete().run(req.app.locals.db_connection, function(err, result) {
        if (err) {
            res.status(500);
            response = err;
        } else {
            res.status(200);
            response = result;
        }
        res.json(response);
    })
});

/**
 * Route to delete a service object from database using post. Requires a valid json {"id":"id-here"}
 */
router.post('/services/delete', function(req, res) {
    var service = req.body;
    var response = null;

    //Validate required parameters
    if ( !service.id ) {response = {"ErrorMessage": "Invalid id"}; res.status(500); res.json(response);}

    //If Validation passes lets insert the service into the database
    r.db('nark').table('services').get(service.id).delete().run(req.app.locals.db_connection, function(err, result) {
        if (err) {
            res.status(500);
            response = err;
        } else {
            res.status(200);
            response = result;
        }
        res.json(response);
    })
});

/**
 * Route to update a service object in the database using post. Requires a valid json
 */
router.post('/services/update', function(req, res) {
    var service = req.body;
    var response = null;

    //Validate required parameters
    if ( !service.id ) {response = {"ErrorMessage": "Invalid id"}; res.status(500); res.json(response);}
    if ( !service.hostname ) {response = {"ErrorMessage": "Invalid hostname"}; res.status(500); res.json(response);}
    if ( !service.path ) {response = {"ErrorMessage": "Invalid path"}; res.status(500); res.json(response);}
    if ( !service.method ) {response = {"ErrorMessage": "Invalid method"}; res.status(500); res.json(response);}

    //If Validation passes lets insert the service into the database
    r.db('nark').table('services').get(service.id).replace(service).run(req.app.locals.db_connection, function(err, result) {
        if (err) {
            res.status(500);
            response = err;
        } else {
            res.status(200);
            response = result;
        }
        res.json(response);
    })
});



module.exports = router;