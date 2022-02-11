// Declare global constants
const config = require('../config.js');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;
let db;
(async () => {
    db = await open({
        filename: './fender_platform_exercise_data.db',
        driver: sqlite3.Database
    })
})();

/**
 * Gets a user's row in the user table via primary key of email
 *
 * @param   {String} email The user's email address
 *
 * @returns {Object} The user's data
 */
const getUserRow = async (email) => {
    const queryParams = [email];
    const getUserSql = "SELECT * FROM users where email = ?";
    const userRow = await db.get(getUserSql, queryParams);
    if (!userRow) {
        console.log(`User row not found`);
        throw new Error(`Record not found for user email ${email}`);
        return;
    }
    return userRow;
};

/**
 * Attempt to log user in given valid credentials, attach JWT auth to HTTP response
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const login = async (req, res) => {
    console.log(`login()`);
    const user = req.body;
    try {
        const userRow = await getUserRow(user.email);
        const passwordIsCorrect = await bcrypt.compare(user.password, userRow.password);
        if (passwordIsCorrect) {
            const token = await jwt.sign({email: user.email, name: user.name}, config.APP_KEYS.SECRET);
            res.json({
                success: true,
                message: "Login successful!",
                token: token,
            });
        } else {
            throw new Error("Incorrect password");
        }
    } catch (err) {
        if (err.message.includes('not found')) {
            res.status(404).json({error: err.message});
        } else {
            res.status(400).json({error: err.message});
        }
    }
    return;
};

// Add endpoint to router object
router.post('/', login);

module.exports = router;
