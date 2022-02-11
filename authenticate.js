const jwt = require('jsonwebtoken');

/**
 * Authenticate JWT token against secret to determine if request is authorized
 *
 * @param   {String} token The JWT token in the request headers
 * @param   {String} secret The application's secret key
 *
 * @returns {Object} Authentication results
 */
const authenticateRequest = async (req, secret) => {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const authCheckResults = jwt.verify(token, secret);
    return authCheckResults;
}

module.exports = {
    authenticateRequest: authenticateRequest,
};
