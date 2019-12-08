const express = require('express');
const router = express.Router();
this.databaseConnected = false;
this.database = null;

// set the database from the outside
router.setDatabase = (db) => {
    this.database = db;
    this.databaseConnected = true;
}

// returns the amount of messages within a certain timespan, or all-time
router.get('/', async (req, res, next) => {
    // get API-query-parameters
    let channelId = req.query.channel;
    let guildId = req.query.guild;
    let startTime = req.query.start;
    let endTime = req.query.end;

    // request all messages from the database
    let messages = await this.database.collection('messages').find({ channelId: channelId, guildId: guildId }).toArray();

    // if both time parameters are undefined, just return the messageCount of all messages
    if((endTime == null || endTime == undefined) && (startTime == null || startTime == undefined)) {
        res.status(200).json({
            result: messages.length
        });
        return;
    }

    // if the end time wasn't defined, pick the latest possible date
    if(endTime == null || endTime == undefined) {
        endTime = new Date(8640000000000000);
    }

    // if the start time wasn't defined, pick the earliest possible date
    if(startTime == null || endTime == undefined) {
        startTime = new Date(-8640000000000000);
    }

    let messageCount = 0;
    messages.forEach(message => {
        // convert messages date-string into a date-number
        let messageDate = Date.parse(message.createdAt);
        // if the date falls into the specific time
        if(messageDate > startTime && messageDate < endTime) {
            // add 1 to the messageCount
            messageCount++;
        }
    });

    res.status(200).json({
        result: messageCount
    });
});

module.exports = router;