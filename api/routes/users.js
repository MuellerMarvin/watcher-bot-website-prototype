const express = require('express');
const router = express.Router();
this.databaseConnected = false;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

router.get('/', (req, res, next) => {
        // allow same origin
        res.append('Access-Control-Allow-Origin', ['*']);

        // if the database isn't connected already
        if(!this.databaseConnected) {
            res.status(200).json({
                message: "database awaiting connection"
            });
        }
});

router.get('/:userId', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const userId = req.params.userId;

    this.database.collection('users').find({ _id: "user:" + userId.toString() }).toArray(function(err, result) {
        res.status(200).json({
            result: result
        });
        console.log("User <" + userId + "> was returned.")
    });
});

module.exports = router;