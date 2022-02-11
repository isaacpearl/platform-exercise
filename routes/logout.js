// Declare global constants
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
const auth = require('../authenticate.js');
const config = require('../config.js');

/**
 * Adds a JWT token to the blacklist database
 *
 * @param   {Object} db The SQLite instance
 * @param   {String} token The JWT token
 * @param   {Object} metadata The token metadata
 */
const addTokenToBlacklist = async (db, token, metadata) => {
    console.log('addTokenToBlacklist()');
    const addTokenSql = 'INSERT INTO blacklist (token, user_id, expiration_date) VALUES (?,?,?)';
    const addTokenQueryParams = [token, metadata.id, metadata.exp];
    const insertResult = await db.run(addTokenSql, addTokenQueryParams);
    return;
};

/**
 * Attempt to log user out
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const logout = async (req, res) => {
    console.log(`logout()`);
    let db;
    try {
        db = await open({
            filename: './fender_platform_exercise_data.db',
            driver: sqlite3.Database,
        });
        const authHeader = req.get("Authorization");
        const token = authHeader.split(" ")[1];
        const authStatus = await auth.authenticateRequest(db, req, config.APP_KEYS.SECRET);
        await addTokenToBlacklist(db, token, authStatus);
        res.json({
            message: "success",
            data: {
                message: 'Successfully logged out.'
            },
        });
        await db.close();
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.message.includes('not authorized')) {
            res.status(403).json({error: err.message});
        } else if (err.message.includes('not found')) {
            res.status(404).json({error: err.message});
        } else {
            res.status(400).json({error: err.message});
        }
        if (db) {
            await db.close();
        }
    }
    return;
};

// Add endpoint to router object
router.post('/', logout);

module.exports = {
    router: router,
};
