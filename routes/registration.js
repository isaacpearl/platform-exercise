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
 * Create new user 
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const registerUser = async (req, res) => {
    console.log(`registerUser()`);
    return;
};

// Add endpoint to router object
router.post('/', registerUser);

module.exports = router;
