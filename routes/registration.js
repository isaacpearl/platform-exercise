// Declare global constants
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;

/**
 * Validates new user POST request input
 *
 * @param   {Object} body The new user registration request parameters
 *
 * @returns {String[]} All applicable error messages
 */
const validateInput = (body) => {
    const inputErrors = [];
    const containsLettersRegex = /.*[a-zA-Z].*/g;
    const containsDigitsRegex = /\d/g;
    if (!body.name){
        inputErrors.push("No user name specified");
    }
    if (!body.email) {
        inputErrors.push("No user email specified");
    }
    if (!body.password) {
        inputErrors.push("No user password specified");
    }
    if (body.password && !(body.password.match(containsLettersRegex) && body.password.match(containsDigitsRegex))) {
        inputErrors.push("Password must contain both numbers and letters");
    }
    if (body.email && !body.email.includes("@")) {
        inputErrors.push("Email must contain an \'@\' symbol");
    }
    return inputErrors;
}

/**
 * Add new row to users table
 *
 * @param   {Object} db The SQLite instance
 * @param   {String} email The user's email address
 * @param   {String} password The user's (hashed) password
 * @param   {String} name The user's name
 *
 * @returns {Object} The data written to the users table
 */
const writeNewUser = async (db, email, password, name) => {
    const createUserSql = 'INSERT INTO users (email, password, name) VALUES (?,?,?)';
    const createUserQueryParams = [email, password, name];
    const insertResult = await db.run(createUserSql, createUserQueryParams);
    return {
        name: name,
        email: email,
    };
};

/**
 * Create new user 
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const registerUser = async (req, res) => {
    console.log(`registerUser()`);
    let db;
    try {
        db = await open({
            filename: './fender_platform_exercise_data.db',
            driver: sqlite3.Database,
        })
        const inputErrors = validateInput(req.body);
        if (inputErrors.length > 0) {
            res.status(400).json({"error": inputErrors.join(", ")});
            return;
        }
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await writeNewUser(db, email, hashedPassword, name);
        res.json({
            "message": "success",
            "data": newUser,
        });
        await db.close();
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed: users.email')) {
            // Return 409 Conflict error, but we could use 204 or 202 with generic "wait for confirmation" message instead for security purposes
            res.status(409).json({error: `User already exists with email ${email}`});
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
router.post('/', registerUser);

module.exports = router;
