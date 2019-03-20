module.exports = (sequelize, Sequelize) => {
	const Doc = sequelize.define('doc', {
		projectid: {
			type: Sequelize.INTEGER
		},
		authorId: {
			type: Sequelize.INTEGER
		},
		filename: {
			type: Sequelize.STRING
		},
		path: {
			type: Sequelize.STRING
		},
		versions: {
			type: Sequelize.ARRAY(Sequelize.INTEGER)
		},
		validated: {
			type: Sequelize.BOOLEAN
		},
		published: {
			type: Sequelize.BOOLEAN
		}
	});

	return Doc;
}

