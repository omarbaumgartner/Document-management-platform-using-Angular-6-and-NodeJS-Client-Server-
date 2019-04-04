module.exports = function (app) {
    const users = require('../controller/user.controller.js');

    // Create a new User
    app.post('/api/users', users.createUser);

    // Retrieve all Users
    app.get('/api/users', users.findAll);

    // Retrieve a single User by Id
    app.get('/api/users/id/:id', users.findByPk);

    // Check if an email is already existing
    app.get('/api/users/email/:email', users.checkEmail);

    // Retrieve a single User by Token
    app.get('/api/users/token/:token', users.findByToken);

    // Update a User with Id
    app.put('/api/users', users.update);

    // Delete a User with Id
    app.delete('/api/users/:id', users.delete);


}