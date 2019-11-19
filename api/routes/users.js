const express = require('express');
const router = express.Router();
this.databaseConnected = false;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

router.get('/', (req, res, next) => {
        // if the database isn't connected already
        if(!this.databaseConnected) {
            res.status(200).json({
                message: "database awaiting connection"
            });
        }

        // get all user IDs and return them
        this.database.collection('users').find().toArray(function(err, results) {
            var userIds = [];
            results.forEach(user => {
                userIds.push(user._id.slice(5));
            });
            res.status(200).json({
                result: userIds,
            });
            console.log("IDs of all users returned.")
        });
});

router.get('/:userId', (req, res, next) => {
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