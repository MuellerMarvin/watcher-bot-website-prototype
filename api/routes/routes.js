const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
this.databaseConnected = false;
this.database = null;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

// returns a route
router.get('/:routeId', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const routeId = req.params.routeId;
    try {
        this.database.collection('routes').find({ _id: mongodb.ObjectID(routeId.toString()) }).toArray(function(err, result) {
            res.status(200).json({
                result: result
            });
            console.log("Route <" + routeId + "> was returned.")
        });
    } catch (error) {
        res.status(200).json({
            result: "Error"
        });
    }
});

module.exports = router;