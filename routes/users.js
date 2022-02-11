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
 * Update user data
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const updateUser = async (req, res) => {
    console.log(`updateUser()`);
    return;
};

/**
 * Delete a user row from the database
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const deleteUser = async (req, res) => {
    console.log(`deleteUser()`);
    return;
};

/**
 * Retrieve a user row from the database
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const getUser = async (req, res) => {
    console.log(`getUser()`);
    return
};

// Add endpoints to router object
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
