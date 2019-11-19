const express = require('express');
const app = express();

// sets the database for all routes
app.setDatabase = (database) => {
    guildRoutes.setDatabase(database);
    userRoutes.setDatabase(database);
}

// Define Routes
const guildRoutes = require('./routes/guilds');
const userRoutes = require('./routes/users');

// Connect Routes
app.use('/guilds', guildRoutes);
app.use('/users', userRoutes);

module.exports = app;