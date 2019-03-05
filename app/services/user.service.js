const db = require('../config/db.config');
const User = db.users;

module.exports = {
    createUser,
    findAll,
    findByPk,
    update,
    remove,
    findByToken,

};

async function createUser(req, res) {
    // Save to PostgreSQL database
    User.create({
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "role": req.body.role,
        "email": req.body.email,
        "password": req.body.password,
        "token": "token"
    })
}
//Retrieve users from db
async function findAll() {
    // Save to PostgreSQL database
    return User.findAll();
}

async function findByPk(req) {
    // Save to PostgreSQL database
    return User.findByPk(req.params.id);
}

async function findByToken(req) {
    // Save to PostgreSQL database
    return User.find({ where: { token: req.params.token } });
}

async function update(req, id) {
    // Save to PostgreSQL database
    User.update(req.body,
        { where: { id: id } });
}

async function remove(id) {
    // Save to PostgreSQL database
    User.destroy({ where: { id: id } });
}
    // Return to front if the User token has expired or not yet


