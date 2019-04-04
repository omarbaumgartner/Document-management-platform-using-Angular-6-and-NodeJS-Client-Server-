module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		firstname: {
			type: Sequelize.STRING
		},
		lastname: {
			type: Sequelize.STRING
		},
		role: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		token: {
			type: Sequelize.STRING
		},
		resetcode: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.BOOLEAN
		}
	});

	return User;
}