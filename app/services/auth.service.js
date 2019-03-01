const config = require('../../JWTconfig.json');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const User = db.users;


module.exports = {
    authenticate,
    getAll
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ where: { 'email': email } });
    //  const user = User.find({ where: { 'email': email }, where: { 'password': password } });
    if (user && user.password == password) {
        //insertion BDD du token
        const token = jwt.sign({ id: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + (60 * 5) }, config.secret);
        user.token = token;
        console.log("This is the secret key : " + config.secret);
        User.update({ "token": token },
            { where: { 'id': user.id } });
        return {
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
