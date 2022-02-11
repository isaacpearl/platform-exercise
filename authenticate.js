const jwt = require('jsonwebtoken');

/**
 * Authenticate JWT token against secret to determine if request is authorized
 *
 * @param   {String} token The JWT token in the request headers
 * @param   {String} secret The application's secret key
 *
 * @returns {Boolean} Whether or not the request is authorized
 */
const authenticateRequest = async (req, secret) => {
    const authHeader = req.get("Authorization");
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    const authCheckResults = jwt.verify(token, secret);
    console.log(authCheckResults);
    return authCheckResults;
}

module.exports = {
    authenticateRequest: authenticateRequest,
};
