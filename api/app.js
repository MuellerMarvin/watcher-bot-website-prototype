const express = require('express');
const app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient();
const url = "mongodb://localhost:27017/"

// Define Routes
const guildRoutes = require('./api/routes/guild');
const userRoutes = require('./api/routes/user');

// Connect Routes
app.use('/guilds', guildRoutes);
app.use('users', userRoutes);

module.exports = app;