const config = require('../../JWTconfig.json');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const User = db.users;
const Notif = db.notifs;
const sendEmail = require('../config/email.config');


let FrontEnd = "http://localhost:4200/"

module.exports = {
    lostPassword,
    changePassword,
    addUserToProject,
    getNotifications,
    updateNotifications,
    clearNotifications
};

// Send email to Added User to project
async function addUserToProject(req, res) {
    for (let i = 0; i < req.members.length; i++) {
        User.findOne({ where: { id: req.members[i] } })
            .then((user) => {
                sendEmail(user.email, "[DeepDocs] You've been added to project : " + req.name, "You've been added to project : " + req.name);
                Notif.create({
                    "userid": user.id,
                    "message": "You've been added to " + req.name + " project.",
                })
            })
    }
}

// Send email to reset password
async function lostPassword(req, res) {
    return User.findOne({ where: { email: req.params.email } })
        .then((user) => {
            if (user != null) {
                let tokenReset = jwt.sign({ id: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 5) }, config.secret);
                let link = FrontEnd + "auth/reset/" + tokenReset;
                sendEmail(user.email, '[DeepDocs] Password Reset', PasswordResetText + link);
                Notif.create({
                    "userid": user.id,
                    "message": "You asked for a password reset",
                })
                User.update({ resetcode: tokenReset }, { where: { id: user.id } });
                return true;
            }
            else {
                return false;
            }
        })
}

// Retrieve user notifications
async function getNotifications(req, res) {
    return Notif.findAll({ where: { userid: req.params.id } })
}

async function clearNotifications(req, res) {
    return Notif.destroy({ where: { userid: req.params.id } })
}

async function updateNotifications(req, res) {
    console.log("yas")
    return Notif.update({ "opened": true }, { where: { userid: req.params.id } })
}
// Check link validity
async function changePassword(req, res) {
    // Save to PostgreSQL database
    return User.findOne({ where: { resetcode: req.token } })
        .then((user) => {
            if (user != null) {
                User.update({ password: req.password, resetcode: "" }, { where: { id: user.id } })
                return true;
            }
            else
                return false;
        })

}





const PasswordResetText = "Hi,\nResetting your password is easy. Just click the link below and follow the instructions. We'll have you up and running in no time.\n"