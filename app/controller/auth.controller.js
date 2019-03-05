const authService = require('../services/auth.service');

exports.authenticate = (req, res) => {
    authService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
};

exports.getAll = (req, res, next) => {
    authService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

// Return to front if the User token has expired or not yet
exports.checkToken = (req, res) => {

}