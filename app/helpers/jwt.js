const expressJwt = require('express-jwt');
const config = require('../../JWTconfig.json');

//module.exports = jwt;

/*function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/authenticate',
            '/api/users',
            '/api/users/:id',
            '/api/upload,'
        ]
    });
}
*/