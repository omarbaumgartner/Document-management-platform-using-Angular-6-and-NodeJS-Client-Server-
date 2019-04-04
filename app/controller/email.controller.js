const emailService = require('../services/email.service');


exports.lostPassword = (req, res) => {
    // Save to PostgreSQL database
    emailService.lostPassword(req, res)
        .then(val => {
            // Send created user to client
            res.json(val);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};

exports.changePassword = (req, res) => {
    // Save to PostgreSQL database
    emailService.changePassword(req.body, res)
        .then(val => {
            // Send created user to client
            res.json(val);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};