const config = require('../../JWTconfig.json');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const User = db.users;
const sendEmail = require('../config/email.config');


let FrontEnd = "http://localhost:4200/"

module.exports = {
    lostPassword,
    changePassword,
    addUserToProject,

};

// Send email to Added User to project
async function addUserToProject(req, res) {
    for (let i = 0; i < req.members.length; i++) {
        User.findOne({ where: { id: req.members[i] } })
            .then((user) => {
                sendEmail(user.email, '[DeepDocs] Vous êtes ajouté au projet ' + req.name, "Ajout au projet : " + req.name);
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
                sendEmail(user.email, '[DeepDocs] Réinitialisation du mot de passe', PasswordResetText + link);
                User.update({ resetcode: tokenReset }, { where: { id: user.id } });
                return true;
            }
            else {
                return false;
            }
        })
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



// Added document to project
async function addDocumentToProject(req, res) {

}


const PasswordResetText = "Bonjour,\nVous avez demandé une réinitialisation de votre mot de passe.\nVeuillez cliquer sur le lien ci-dessous : \n"