const express = require('express');
const router = express.Router();
var database = null;

// set the database from the outside
router.setDatabase = (db) => {
    database = db;
}

router.get('/', (req, res, next) => {
    database.collection('guilds').insertOne({ test: true })
    .then(function() {
        //respond
        res.status(200).json({
            message: "inserted",
        });
    });

    // TO DO:
    // database request and returning of date
});

router.get('/:guildId', (req, res, next) => {
    // retrieve API-parameter
    const guildId = req.params.guildId;

    //respond
    res.status(200).json({
        message: 'one guild'
    });

    // TO DO:
    // database request and returning of date
});

module.exports = router;