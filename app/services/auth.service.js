const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const User = db.users;
const bcrypt = require('bcryptjs');


// users hardcoded for simplicity, store in a db for production applications
//const users = [{ id: 1, email: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};
/*async function authenticate({ email, password }) {

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}*/

// Working --
async function authenticate({ email, password }) {
    const user = await User.findOne({ where: { 'email': email } });
    //  const user = User.find({ where: { 'email': email }, where: { 'password': password } });
    if (user && user.password == password) {
        const token = jwt.sign({ sub: user.id, exp: Math.floor(Date.now() / 1000) + (60 * 60), role: 'hisrole' }, config.secret);
        return {
            user,
            token
        };
    }
}


/*async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}*/



async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
