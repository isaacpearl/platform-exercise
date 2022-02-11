// Declare global constants
const express = require('express');
const router = express.Router();
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
 * Attempt to log user out
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const logout = async (req, res) => {
    console.log(`logout()`);
    return;
};

// Add endpoint to router object
router.post('/', logout);

module.exports = router;
