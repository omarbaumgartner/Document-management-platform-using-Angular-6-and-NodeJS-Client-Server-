module.exports = function (app) {
    const auths = require('../controller/auth.controller.js');

    // Create a new User
    app.post('/api/signin', auths.signin);


}