const jwt = require('jsonwebtoken');

/**
 * Looks up a JWT token in the blacklist
 *
 * @param   {Object} db The SQLite instance
 * @param   {String} token The JWT token to check
 *
 * @returns {Object} The blacklist row data for the JWT token
 */
const checkBlacklist = async (db, token) => {
    const params = [token];
    const getTokenSql = "SELECT * FROM blacklist WHERE token = ?";
    const tokenRow = await db.get(getTokenSql, params);
    return tokenRow; 
};

/**
 * Authenticate JWT token against secret to determine if request is authorized
 *
 * @param   {Object} db The SQLite instance
 * @param   {String} token The JWT token in the request headers
 * @param   {String} secret The application's secret key
 *
 * @returns {Object} Authentication results
 */
const authenticateRequest = async (db, req, secret) => {
    console.log('authenticateRequest()');
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const blacklistResults = await checkBlacklist(db, token);
    console.log(blacklistResults);
    if (blacklistResults) {
        throw new Error('User not authorized, please log back in');
    }
    const authCheckResults = jwt.verify(token, secret);
    return authCheckResults;
}

module.exports = {
    authenticateRequest: authenticateRequest,
};
