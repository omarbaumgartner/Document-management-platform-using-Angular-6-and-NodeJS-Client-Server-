module.exports = (sequelize, Sequelize) => {
	const Doc = sequelize.define('doc', {
		filename: {
			type: Sequelize.STRING
		},
		relativename: {
			type: Sequelize.STRING
		},
		encoding: {
			type: Sequelize.STRING
		},
		extension: {
			type: Sequelize.STRING
		},
		path: {
			type: Sequelize.STRING
		},
		sizeinko: {
			type: Sequelize.STRING
		},
		content: {
			type: Sequelize.STRING
		}
	});

	return Doc;
}

