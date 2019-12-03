const express = require('express');
const router = express.Router();
this.databaseConnected = false;
this.database = null;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

router.use('/:guildId/:channelId', (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const guildId = req.params.guildId;
    const channelId = req.params.channelId;

    this.database.collection('messages').find({ guildId: guildId.toString(), channelId: channelId.toString() }).count(function(err, result) {
        res.status(200).json({
            result: result
        });
        console.log("Messagecount for <" + channelId + "> in <" + guildId + "> was returned");
    });
});

module.exports = router;