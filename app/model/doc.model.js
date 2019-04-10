module.exports = (sequelize, Sequelize) => {
	const Doc = sequelize.define('document', {
		projectid: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		authorid: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		filename: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		path: {
			type: Sequelize.STRING
		},
		versions: {
			type: Sequelize.ARRAY(Sequelize.INTEGER)
		},
		validated: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		published: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		}
	});

	return Doc;
}

