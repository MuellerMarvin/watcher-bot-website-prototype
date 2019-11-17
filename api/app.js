const express = require('express');
const app = express();

// Routes
const guildRoutes = require('./api/routes/guild');
const userRoutes = require('./api/routes/user');

app.use('/guilds', guildRoutes);
app.use('users', userRoutes);

module.exports = app;