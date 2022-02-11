// Declare global constants
const config = require('../config.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../authenticate.js');
const logout = require('./logout.js');
const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;

/**
 * Update user data
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 */
const updateUser = async (req, res) => {
    console.log(`updateUser()`);
    const queryParams = [req.params.id, req.body];
    const putOperation = async (db, params) => {
        let setString = "";
        const body = params[1];
        // TODO: validate input
        for (let i = 0; i < Object.keys(body).length; i++) {
            const field = Object.keys(body)[i];
            setString += `${field} = '${body[field]}'`;
            if (i < Object.keys(body).length - 1) {
                setString += `,\n`;
            }
        }
        const updateUserSql = `
            UPDATE users SET ${setString} WHERE id = ?`;
        const userRow = await db.run(updateUserSql, [params[0]]);
        console.log(userRow);
        if (!userRow) {
            console.log(`User row not found`);
            throw new Error(`Record not found for user id ${params[0]}`);
            return;
        }
        return {
            id: userRow.id,
            email: userRow.email,
            name: userRow.name,
        };
    };
    await authenticatedUserRequest(req, res, putOperation, queryParams);
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
    const queryParams = [req.params.id];
    const deleteOperation = async (db, params) => {
        const deleteUserSql = "DELETE FROM users WHERE id = ?";
        const userRow = await db.run(deleteUserSql, params);
        console.log(userRow);
        if (!userRow) {
            console.log(`User row not found`);
            throw new Error(`Record not found for user id ${params[0]}`);
            return;
        }
        return {
            id: userRow.id,
            email: userRow.email,
            name: userRow.name,
        };
    };
    await authenticatedUserRequest(req, res, deleteOperation, queryParams);
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
    const queryParams = [req.params.id];
    const getOperation = async (db, params) => {
        const getUserSql = "SELECT * FROM users WHERE id = ?";
        const userRow = await db.get(getUserSql, params);
        if (!userRow) {
            console.log(`User row not found`);
            throw new Error(`Record not found for user id ${params[0]}`);
            return;
        }
        return {
            id: userRow.id,
            email: userRow.email,
            name: userRow.name,
        };
    };
    await authenticatedUserRequest(req, res, getOperation, queryParams);
    return;
};

/**
 * Wrapper to run authenticated user requests on their own data
 *
 * @param   {Object} req The request object
 * @param   {Object} res The response object
 * @param   {Callback} operation The CRUD operation to execute
 * @param   {Array} args The arguments to the CRUD operation
 *
 * @returns {Object} Authentication details
 */
const authenticatedUserRequest = async (req, res, operation, args) => {
    let db;
    try {
        db = await open({
            filename: './fender_platform_exercise_data.db',
            driver: sqlite3.Database
        });
        const authStatus = await auth.authenticateRequest(db, req, config.APP_KEYS.SECRET);
        if (authStatus.id !== parseInt(req.params.id)) {
            // TODO: add handling for admin users? e.g. ability to view/edit/remove other users' data
            throw new Error ('User not authorized');
        }
        const operationResults = await operation(db, args);
        res.json({
            message: "success",
            data: operationResults,
        });
        await db.close();
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.message.includes('not authorized')) {
            res.status(403).json({error: err.message});
        } else if (err.message.includes('not found')) {
            res.status(404).json({error: err.message});
        } else if (err.message.includes('UNIQUE constraint failed: users.email')) {
            res.status(409).json({error: `Email address is already taken`});
        } else if (err.message.includes('jwt expired')) {
            res.status(403).json({error: 'Token expired, please log in again'});
        } else {
            res.status(400).json({error: err.message});
        }
        if (db) {
            await db.close();
        }
    }
    return;
};

// Add endpoints to router object
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
