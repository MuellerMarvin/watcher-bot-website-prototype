const http = require('http');
const app = require('./app');
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.databaseUrl, { useUnifiedTopology: true });

function initiateDatabase() {
    mongoClient.connect((err, db) => {
        if (err) throw err;
        console.log("Database connected.");

        // only after it's connected
        app.setDatabase(mongoClient.db(config.databaseName));
    })
}

const port = process.env.PORT || config.port || 3001;
const server = http.createServer(app);

initiateDatabase();
server.listen(port);