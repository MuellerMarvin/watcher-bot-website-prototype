const express = require('express');
const app = express();

// sets the database for all routes
app.setDatabase = (database) => {
    guildRoutes.setDatabase(database);
    routeRoutes.setDatabase(database);
}

// Define Routes
const guildRoutes = require('./routes/guilds');
const routeRoutes = require('./routes/routes');

// Connect Routes
app.use('/guilds', guildRoutes);
app.use('/routes', routeRoutes);

module.exports = app;