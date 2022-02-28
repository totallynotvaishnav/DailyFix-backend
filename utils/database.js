const mongoDB = require('mongodb');

const mongoClient = mongoDB.MongoClient;

const URI =
    'mongodb+srv://vaishnav:zPFTtpNeyRkLxWPN@cluster0.acy7w.mongodb.net/dailyfix?retryWrites=true&w=majority';

const connect = mongoClient.connect(URI, {
    wtimeoutMS: 2500,
    w: 'majority',
    useUnifiedTopology: true,
});

module.exports = connect;
