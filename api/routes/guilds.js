const express = require('express');
const router = express.Router();
this.databaseConnected = false;
this.database = null;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

// returns all guilds
router.get('/', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // if the database isn't connected already
    if(!this.databaseConnected) {
        res.status.json({
            message: "database awaiting connection"
        });
    }
});

// returns a specific guild
router.get('/:guildId', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const guildId = req.params.guildId;

    this.database.collection('guilds').find({ guildId: guildId.toString() }).toArray(function(err, result) {
        res.status(200).json({
            result: result
        });
        console.log("Guild <" + guildId + "> was returned.")
    });
});

module.exports = router;