const authService = require('../services/auth.service');
var jwt_decode = require('jwt-decode');


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
    var decodedtoken = jwt_decode(req.params.token);
    var actualDate = Math.round(new Date().getTime() / 1000);
    authService.checkToken(req)
        .then(result => {
            if (result.dataValues != null && decodedtoken.exp > actualDate) {
                res.send(true);
            }
            else
                res.send(false);

        })
        .catch(err => next(err));
}