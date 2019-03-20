module.exports = function (app) {
    const auth = require('../controller/auth.controller.js');

    // Authenticate
    app.post('/authenticate', auth.authenticate);

    //
    app.get('/auths', auth.getAll);

    // Return to front if the User token has expired or not yet
    app.get('/authguard/:token', auth.checkToken);

}