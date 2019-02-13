const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const User = db.users;
const bcrypt = require('bcryptjs');
const users = require('../controller/user.controller.js');


// users hardcoded for simplicity, store in a db for production applications
//const users = [{ id: 1, email: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};

// Working --
async function authenticate({ email, password }) {
    const user = await User.findOne({ where: { 'email': email } });
    //  const user = User.find({ where: { 'email': email }, where: { 'password': password } });
    if (user && user.password == password) {
        //insertion BDD du token
        //changemlent
        const token = jwt.sign({ sub: user.id, exp: Math.floor(Date.now() / 1000) + (60 * 60), role: 'hisrole' }, config.secret);
        user.token = token;
        User.update({ "token": token },
            { where: { 'id': user.id } });
        return {
            user,
            token
        }

    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
