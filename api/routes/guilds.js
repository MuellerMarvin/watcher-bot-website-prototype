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
router.get('/:guildId', async (req, res, next) => {
    // allow same origin
    res.append('Access-Control-Allow-Origin', ['*']);

    // retrieve API-parameter
    const guildId = req.params.guildId;

    // get guild from database
    var result = await this.database.collection('guilds').find({ guildId: guildId.toString() }).toArray();
    guild = result[0];

    // get channels from database
    guild.channels = await this.database.collection('channels').find({ guildId: guildId.toString() }).toArray();

    // get users from database
    for (let i = 0; i < guild.members.length; i++) {
        let user = await this.database.collection('users').find({ userId: guild.members[i] }).toArray();
        guild.members[i] = user[0];
    }

    res.status(200).json({
        result: guild
    });

    console.log("Guild <" + guildId + "> was returned.")
});

module.exports = router;