const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    //respond
    res.status(200).json({
        message: 'all guilds'
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