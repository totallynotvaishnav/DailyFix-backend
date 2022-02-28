const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const connect = require('./utils/database');

const Writings = require('./models/writings');
const Users = require('./models/users');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

connect
    .then(async (client) => {
        console.log('connected!');
        await Writings.injectDB(client);
        await Users.injectDB(client);
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
