require('dotenv').config();
const mongoDB = require('mongodb');

const mongoClient = mongoDB.MongoClient;

const URI = process.env.MONGODB_URI;

const connect = mongoClient.connect(URI, {
    wtimeoutMS: 2500,
    w: 'majority',
    useUnifiedTopology: true,
});

module.exports = connect;
