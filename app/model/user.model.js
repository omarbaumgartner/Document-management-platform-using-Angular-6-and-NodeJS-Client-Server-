module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		firstname: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		lastname: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		role: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		token: {
			type: Sequelize.STRING
		},
		resetcode: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		}
	});

	return User;
}