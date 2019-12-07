const express = require('express');
const router = express.Router();
this.databaseConnected = false;
this.database = null;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

router.use('/:guildId', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const guildId = req.params.guildId;

    this.database.collection('channels').find({ guildId: guildId.toString() }).toArray(function(err, result) {
        res.status(200).json({
            result: result
        });
        console.log("Channels for guild <" + guildId + "> were returned.");
    });

    console.log(guildId);
});

module.exports = router;