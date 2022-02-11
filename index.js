// Declare global constants
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const login = require('./routes/login.js');
const registration = require('./routes/registration.js');
const logout = require('./routes/logout.js');
const users = require('./routes/users.js')
const db = require('./initialize_db.js');
const config = require('./config.js');

// Set CORS permissively for development, TODO: lock down in production setting
app.use(
    cors({
        credentials: true,
        origin: true,
    })
);
app.options('*', cors());

// Parse JSON POST body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use imported route modules
app.use('/api/v1/login', login);
app.use('/api/v1/register', registration);
app.use('/api/v1/logout', logout.router);
app.use('/api/v1/users', users);

// Confirm open port in console when server starts up
app.listen(process.env.PORT || config.SETTINGS.PORT, () => {
    console.log(`server running on ${process.env.PORT || config.SETTINGS.PORT}`);
});
