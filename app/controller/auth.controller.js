const db = require('../config/db.config.js');
const User = db.users;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signin = (req, res) => {
    console.log("Sign-In");

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send('User Not Found.');
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true });
        console.log("Success");
        console.log(auth);
    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}
