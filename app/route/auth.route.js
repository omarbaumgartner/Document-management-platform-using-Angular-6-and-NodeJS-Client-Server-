module.exports = function (app) {
    const auth = require('../controller/auth.controller.js');

    // Authenticate
    app.post('/authenticate', auth.authenticate);

    //
    app.get('/auths', auth.getAll);

}