const express = require('express');
const router = express.Router();
var database = null;

// set the database from the outside
router.setDatabase = (db) => {
    database = db;
}

router.get('/', (req, res, next) => {
    //respond
    res.status(200).json({
        message: 'all users'
    });

    // TO DO:
    // database request and returning of date
});

router.get('/:userId', (req, res, next) => {
    // retrieve API-parameter
    const userId = req.params.userId;

    //respond
    res.status(200).json({
        message: 'one user'
    });

    // TO DO:
    // database request and returning of date
});

module.exports = router;