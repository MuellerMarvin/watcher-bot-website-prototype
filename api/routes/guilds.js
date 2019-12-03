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

    // get all guildIDs and return them
    this.database.collection('guilds').find().toArray(function(err, results) {
        var guildIds = [];
        results.forEach(guild => {
            guildIds.push(guild._id.slice(6));
        });
        res.status(200).json({
            result: guildIds,
        });
        console.log("IDs of all guilds returned.")
    });
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