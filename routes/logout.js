// Declare global constants
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;

/**
 * Attempt to log user out
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const logout = async (req, res) => {
    console.log(`logout()`);
    const db = await open({
        filename: './fender_platform_exercise_data.db',
        driver: sqlite3.Database
    })
    await db.close();
    return;
};

// Add endpoint to router object
router.post('/', logout);

module.exports = router;
