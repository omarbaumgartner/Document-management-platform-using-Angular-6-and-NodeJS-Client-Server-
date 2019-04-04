const db = require('../config/db.config');
const User = db.users;

module.exports = {
    createUser,
    findAll,
    findByPk,
    update,
    remove,
    findByToken,
    checkEmail,

};
// Create User
async function createUser(req, res) {
    // Save to PostgreSQL database
    User.create({
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "role": req.body.role,
        "email": req.body.email,
        "password": req.body.password,
        "token": "No token",
        "status": true,
    })
}
//Retrieve all users from db
async function findAll() {
    // Save to PostgreSQL database
    return User.findAll();
}
//Find User by ID
async function findByPk(req) {
    // Save to PostgreSQL database
    return User.findByPk(req.params.id);
}

//Check email validity
async function checkEmail(req) {
    // Save to PostgreSQL database
    return User.findOne({ where: { email: req.params.email } });
}

//Find User by Token
async function findByToken(req) {
    // Save to PostgreSQL database
    return User.findOne({ where: { token: req.params.token } });
}
//Update User informations
async function update(req, id) {
    // Save to PostgreSQL database
    User.update(req.body,
        { where: { id: id } });
}
//Remove User
async function remove(id) {
    // Save to PostgreSQL database
    User.destroy({ where: { id: id } });
}

