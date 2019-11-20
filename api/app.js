const express = require('express');
const app = express();

// sets the database for all routes
app.setDatabase = (database) => {
    guildRoutes.setDatabase(database);
    userRoutes.setDatabase(database);
    routeRoutes.setDatabase(database);
}

// Define Routes
const guildRoutes = require('./routes/guilds');
const userRoutes = require('./routes/users');
const routeRoutes = require('./routes/routes');

// Connect Routes
app.use('/guilds', guildRoutes);
app.use('/users', userRoutes);
app.use('/routes', routeRoutes);

module.exports = app;